import session from "express-session";
import type { Express, RequestHandler } from "express";
import { db } from "./db";
import { adminUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
  }
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  
  const sessionSecret = process.env.SESSION_SECRET;
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, username))
        .limit(1);
      
      if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      req.session.isAdmin = true;
      
      return res.json({ 
        id: user.id, 
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.session.userId && req.session.isAdmin) {
      return res.json({ 
        id: req.session.userId, 
        isAuthenticated: true 
      });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.json({ success: true });
    });
  });

  app.get("/api/login", (req, res) => {
    res.redirect("/admin/login");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });

  app.post("/api/auth/setup", async (req, res) => {
    try {
      const existingUsers = await db.select().from(adminUsers).limit(1);
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: "Admin already exists" });
      }

      const { username, password, firstName, lastName } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const [newUser] = await db
        .insert(adminUsers)
        .values({
          username,
          passwordHash: hashPassword(password),
          firstName: firstName || "Admin",
          lastName: lastName || "User",
        })
        .returning();

      return res.json({ 
        success: true, 
        message: "Admin user created",
        id: newUser.id 
      });
    } catch (error: any) {
      console.error("Setup error:", error);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: error?.message || String(error)
      });
    }
  });

  app.get("/api/auth/needs-setup", async (req, res) => {
    try {
      const existingUsers = await db.select().from(adminUsers).limit(1);
      return res.json({ needsSetup: existingUsers.length === 0 });
    } catch (error: any) {
      console.error("Needs setup check error:", error);
      return res.json({ needsSetup: true, error: error?.message });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.userId && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

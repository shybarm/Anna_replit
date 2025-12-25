import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch("/api/auth/needs-setup");
        const data = await res.json();
        setNeedsSetup(data.needsSetup);
      } catch {
        setNeedsSetup(false);
      } finally {
        setCheckingSetup(false);
      }
    }
    checkSetup();
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        toast({ title: "התחברת בהצלחה", description: "מעביר ללוח הבקרה..." });
        setTimeout(() => setLocation("/admin"), 500);
      } else {
        const data = await res.json();
        toast({ 
          title: "שגיאה בהתחברות", 
          description: data.error || "פרטים שגויים",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "שגיאה", 
        description: "אירעה שגיאה בהתחברות",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, firstName, lastName }),
      });

      if (res.ok) {
        toast({ title: "משתמש נוצר בהצלחה", description: "כעת ניתן להתחבר" });
        setNeedsSetup(false);
        setPassword("");
      } else {
        const data = await res.json();
        toast({ 
          title: "שגיאה", 
          description: data.error || "לא ניתן ליצור משתמש",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "שגיאה", 
        description: "אירעה שגיאה",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {needsSetup ? <UserPlus className="h-6 w-6 text-primary" /> : <Lock className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl">
            {needsSetup ? "הגדרת מנהל ראשון" : "כניסה למערכת הניהול"}
          </CardTitle>
          <CardDescription>
            {needsSetup 
              ? "צור משתמש מנהל ראשון למערכת"
              : "ד״ר אנה ברמלי - מרפאה לאלרגיה ואימונולוגיה"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={needsSetup ? handleSetup : handleLogin} className="space-y-4">
            {needsSetup && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">שם פרטי</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="אנה"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">שם משפחה</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="ברמלי"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">שם משתמש</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  placeholder="admin"
                  required
                  data-testid="input-username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="••••••••"
                  required
                  data-testid="input-password"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              data-testid="button-submit"
            >
              {isSubmitting 
                ? "מעבד..." 
                : needsSetup 
                  ? "צור משתמש" 
                  : "התחבר"
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

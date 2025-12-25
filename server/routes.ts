import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth";
import {
  insertContactMessageSchema,
  insertPatientSchema,
  insertVisitSchema,
  insertPrescriptionSchema,
  insertInvoiceSchema,
  insertAppointmentSchema,
  insertDoctorSettingsSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid form data", details: parsed.error.errors });
      }
      const message = await storage.createContactMessage(parsed.data);
      return res.status(201).json({ success: true, message: "Message received successfully", id: message.id });
    } catch (error) {
      console.error("Error saving contact message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/contact", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/patients", isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getPatients();
      return res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/patients/:id", isAuthenticated, async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) return res.status(404).json({ error: "Patient not found" });
      return res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/patients", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertPatientSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid patient data", details: parsed.error.errors });
      }
      const patient = await storage.createPatient(parsed.data);
      return res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/patients/:id", isAuthenticated, async (req, res) => {
    try {
      const patient = await storage.updatePatient(req.params.id, req.body);
      if (!patient) return res.status(404).json({ error: "Patient not found" });
      return res.json(patient);
    } catch (error) {
      console.error("Error updating patient:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/patients/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deletePatient(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Patient not found" });
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting patient:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/visits", isAuthenticated, async (req, res) => {
    try {
      const patientId = req.query.patientId as string | undefined;
      const visits = patientId ? await storage.getVisitsByPatient(patientId) : await storage.getVisits();
      return res.json(visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/visits/:id", isAuthenticated, async (req, res) => {
    try {
      const visit = await storage.getVisit(req.params.id);
      if (!visit) return res.status(404).json({ error: "Visit not found" });
      return res.json(visit);
    } catch (error) {
      console.error("Error fetching visit:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/visits", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertVisitSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid visit data", details: parsed.error.errors });
      }
      const visit = await storage.createVisit(parsed.data);
      return res.status(201).json(visit);
    } catch (error) {
      console.error("Error creating visit:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/visits/:id", isAuthenticated, async (req, res) => {
    try {
      const visit = await storage.updateVisit(req.params.id, req.body);
      if (!visit) return res.status(404).json({ error: "Visit not found" });
      return res.json(visit);
    } catch (error) {
      console.error("Error updating visit:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/visits/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteVisit(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Visit not found" });
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting visit:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/prescriptions", isAuthenticated, async (req, res) => {
    try {
      const patientId = req.query.patientId as string | undefined;
      const prescriptions = patientId ? await storage.getPrescriptionsByPatient(patientId) : await storage.getPrescriptions();
      return res.json(prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/prescriptions/:id", isAuthenticated, async (req, res) => {
    try {
      const prescription = await storage.getPrescription(req.params.id);
      if (!prescription) return res.status(404).json({ error: "Prescription not found" });
      return res.json(prescription);
    } catch (error) {
      console.error("Error fetching prescription:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/prescriptions", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertPrescriptionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid prescription data", details: parsed.error.errors });
      }
      const prescription = await storage.createPrescription(parsed.data);
      return res.status(201).json(prescription);
    } catch (error) {
      console.error("Error creating prescription:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/prescriptions/:id", isAuthenticated, async (req, res) => {
    try {
      const prescription = await storage.updatePrescription(req.params.id, req.body);
      if (!prescription) return res.status(404).json({ error: "Prescription not found" });
      return res.json(prescription);
    } catch (error) {
      console.error("Error updating prescription:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/prescriptions/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deletePrescription(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Prescription not found" });
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting prescription:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const patientId = req.query.patientId as string | undefined;
      const invoices = patientId ? await storage.getInvoicesByPatient(patientId) : await storage.getInvoices();
      return res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      return res.json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertInvoiceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid invoice data", details: parsed.error.errors });
      }
      const subtotal = parseFloat(parsed.data.subtotal);
      const vatRate = 18;
      const vatAmount = (subtotal * vatRate) / 100;
      const total = subtotal + vatAmount;
      const invoiceData = {
        ...parsed.data,
        vatRate: vatRate.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        total: total.toFixed(2),
      };
      const invoice = await storage.createInvoice(invoiceData);
      return res.status(201).json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (updateData.subtotal) {
        const subtotal = parseFloat(updateData.subtotal);
        const vatRate = 18;
        const vatAmount = (subtotal * vatRate) / 100;
        const total = subtotal + vatAmount;
        updateData.vatRate = vatRate.toFixed(2);
        updateData.vatAmount = vatAmount.toFixed(2);
        updateData.total = total.toFixed(2);
      }
      const invoice = await storage.updateInvoice(req.params.id, updateData);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      return res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteInvoice(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Invoice not found" });
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      return res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) return res.status(404).json({ error: "Appointment not found" });
      return res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const parsed = insertAppointmentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid appointment data", details: parsed.error.errors });
      }
      const appointment = await storage.createAppointment(parsed.data);
      return res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      if (!appointment) return res.status(404).json({ error: "Appointment not found" });
      return res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Appointment not found" });
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getDoctorSettings();
      return res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertDoctorSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid settings data", details: parsed.error.errors });
      }
      const settings = await storage.updateDoctorSettings(parsed.data);
      return res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}

import {
  type ContactMessage,
  type InsertContactMessage,
  type Patient,
  type InsertPatient,
  type Visit,
  type InsertVisit,
  type Prescription,
  type InsertPrescription,
  type Invoice,
  type InsertInvoice,
  type Appointment,
  type InsertAppointment,
  type DoctorSettings,
  type InsertDoctorSettings,
  contactMessages,
  patients,
  visits,
  prescriptions,
  invoices,
  appointments,
  doctorSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;

  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(id: string): Promise<boolean>;

  getVisits(): Promise<Visit[]>;
  getVisitsByPatient(patientId: string): Promise<Visit[]>;
  getVisit(id: string): Promise<Visit | undefined>;
  createVisit(visit: InsertVisit): Promise<Visit>;
  updateVisit(id: string, visit: Partial<InsertVisit>): Promise<Visit | undefined>;
  deleteVisit(id: string): Promise<boolean>;

  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionsByPatient(patientId: string): Promise<Prescription[]>;
  getPrescription(id: string): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: string, prescription: Partial<InsertPrescription>): Promise<Prescription | undefined>;
  deletePrescription(id: string): Promise<boolean>;

  getInvoices(): Promise<Invoice[]>;
  getInvoicesByPatient(patientId: string): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;

  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  getDoctorSettings(): Promise<DoctorSettings | undefined>;
  updateDoctorSettings(settings: InsertDoctorSettings): Promise<DoctorSettings>;
}

export class DatabaseStorage implements IStorage {
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [result] = await db.insert(contactMessages).values(message).returning();
    return result;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getPatients(): Promise<Patient[]> {
    return db.select().from(patients).orderBy(desc(patients.createdAt));
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [result] = await db.insert(patients).values(patient).returning();
    return result;
  }

  async updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [result] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return result;
  }

  async deletePatient(id: string): Promise<boolean> {
    const result = await db.delete(patients).where(eq(patients.id, id)).returning();
    return result.length > 0;
  }

  async getVisits(): Promise<Visit[]> {
    return db.select().from(visits).orderBy(desc(visits.visitDate));
  }

  async getVisitsByPatient(patientId: string): Promise<Visit[]> {
    return db.select().from(visits).where(eq(visits.patientId, patientId)).orderBy(desc(visits.visitDate));
  }

  async getVisit(id: string): Promise<Visit | undefined> {
    const [visit] = await db.select().from(visits).where(eq(visits.id, id));
    return visit;
  }

  async createVisit(visit: InsertVisit): Promise<Visit> {
    const [result] = await db.insert(visits).values(visit).returning();
    return result;
  }

  async updateVisit(id: string, visit: Partial<InsertVisit>): Promise<Visit | undefined> {
    const [result] = await db.update(visits).set(visit).where(eq(visits.id, id)).returning();
    return result;
  }

  async deleteVisit(id: string): Promise<boolean> {
    const result = await db.delete(visits).where(eq(visits.id, id)).returning();
    return result.length > 0;
  }

  async getPrescriptions(): Promise<Prescription[]> {
    return db.select().from(prescriptions).orderBy(desc(prescriptions.prescribedDate));
  }

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.prescribedDate));
  }

  async getPrescription(id: string): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return prescription;
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [result] = await db.insert(prescriptions).values(prescription).returning();
    return result;
  }

  async updatePrescription(id: string, prescription: Partial<InsertPrescription>): Promise<Prescription | undefined> {
    const [result] = await db.update(prescriptions).set(prescription).where(eq(prescriptions.id, id)).returning();
    return result;
  }

  async deletePrescription(id: string): Promise<boolean> {
    const result = await db.delete(prescriptions).where(eq(prescriptions.id, id)).returning();
    return result.length > 0;
  }

  async getInvoices(): Promise<Invoice[]> {
    return db.select().from(invoices).orderBy(desc(invoices.issueDate));
  }

  async getInvoicesByPatient(patientId: string): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.patientId, patientId)).orderBy(desc(invoices.issueDate));
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [result] = await db.insert(invoices).values(invoice).returning();
    return result;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [result] = await db.update(invoices).set(invoice).where(eq(invoices.id, id)).returning();
    return result;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const result = await db.delete(invoices).where(eq(invoices.id, id)).returning();
    return result.length > 0;
  }

  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db.insert(appointments).values(appointment).returning();
    return result;
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [result] = await db.update(appointments).set(appointment).where(eq(appointments.id, id)).returning();
    return result;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }

  async getDoctorSettings(): Promise<DoctorSettings | undefined> {
    const [settings] = await db.select().from(doctorSettings).limit(1);
    return settings;
  }

  async updateDoctorSettings(settings: InsertDoctorSettings): Promise<DoctorSettings> {
    const existing = await this.getDoctorSettings();
    if (existing) {
      const [result] = await db
        .update(doctorSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(doctorSettings.id, existing.id))
        .returning();
      return result;
    }
    const [result] = await db.insert(doctorSettings).values(settings).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();

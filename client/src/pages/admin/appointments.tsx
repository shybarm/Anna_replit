import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";
import { Plus, Calendar, Clock, Trash2, Edit, Check, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import type { Appointment, InsertAppointment } from "@shared/schema";

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

const STATUS_LABELS: Record<string, string> = { scheduled: "מתוכנן", confirmed: "מאושר", completed: "הושלם", cancelled: "בוטל" };
const STATUS_COLORS: Record<string, string> = { scheduled: "secondary", confirmed: "default", completed: "default", cancelled: "destructive" };

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({ queryKey: ["/api/appointments"] });

  const form = useForm<InsertAppointment>({
    defaultValues: { patientName: "", patientPhone: "", patientEmail: "", appointmentDate: "", appointmentTime: "", reason: "", status: "scheduled", notes: "" },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAppointment) => apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "התור נוסף בהצלחה" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה ביצירת תור", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertAppointment> }) =>
      apiRequest("PATCH", `/api/appointments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "התור עודכן" });
      setDialogOpen(false);
      setEditingApt(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה בעדכון תור", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "התור נמחק" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה במחיקת תור", variant: "destructive" });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (editingApt) {
      updateMutation.mutate({ id: editingApt.id, data });
    } else {
      createMutation.mutate(data);
    }
  });

  const openEdit = (apt: Appointment) => {
    setEditingApt(apt);
    form.reset({
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      patientEmail: apt.patientEmail || "",
      appointmentDate: apt.appointmentDate,
      appointmentTime: apt.appointmentTime,
      reason: apt.reason || "",
      status: apt.status,
      notes: apt.notes || "",
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingApt(null);
    form.reset({ patientName: "", patientPhone: "", patientEmail: "", appointmentDate: "", appointmentTime: "", reason: "", status: "scheduled", notes: "" });
    setDialogOpen(true);
  };

  const grouped = appointments.reduce((acc, apt) => {
    const date = apt.appointmentDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" data-testid="text-appointments-title">תורים</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} data-testid="button-add-appointment"><Plus className="ml-2 h-4 w-4" />הוסף תור</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingApt ? "עריכת תור" : "תור חדש"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>שם מטופל *</Label><Input {...form.register("patientName", { required: true })} data-testid="input-patient-name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>טלפון *</Label><Input {...form.register("patientPhone", { required: true })} data-testid="input-patient-phone" /></div>
                <div><Label>אימייל</Label><Input type="email" {...form.register("patientEmail")} data-testid="input-patient-email" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>תאריך *</Label><Input type="date" {...form.register("appointmentDate", { required: true })} data-testid="input-appointment-date" /></div>
                <div>
                  <Label>שעה *</Label>
                  <Controller name="appointmentTime" control={form.control} rules={{ required: true }} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-appointment-time"><SelectValue placeholder="בחר שעה" /></SelectTrigger>
                      <SelectContent>{TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>
              </div>
              <div><Label>סיבת הביקור</Label><Input {...form.register("reason")} data-testid="input-reason" /></div>
              <div>
                <Label>סטטוס</Label>
                <Controller name="status" control={form.control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">מתוכנן</SelectItem>
                      <SelectItem value="confirmed">מאושר</SelectItem>
                      <SelectItem value="completed">הושלם</SelectItem>
                      <SelectItem value="cancelled">בוטל</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div><Label>הערות</Label><Textarea {...form.register("notes")} data-testid="input-notes" /></div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-appointment">
                {editingApt ? "עדכן" : "שמור"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>טוען...</p>
      ) : appointments.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">אין תורים</CardContent></Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, apts]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">{new Date(date).toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h2>
              </div>
              <div className="grid gap-3">
                {apts.sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime)).map((apt) => (
                  <Card key={apt.id} data-testid={`card-appointment-${apt.id}`}>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />{apt.appointmentTime}
                        </div>
                        <CardTitle className="text-base">{apt.patientName}</CardTitle>
                        <Badge variant={STATUS_COLORS[apt.status] as any}>{STATUS_LABELS[apt.status]}</Badge>
                      </div>
                      <div className="flex gap-1">
                        {apt.status === "scheduled" && (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => updateMutation.mutate({ id: apt.id, data: { status: "confirmed" } })} data-testid={`button-confirm-${apt.id}`}><Check className="h-4 w-4 text-green-600" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => updateMutation.mutate({ id: apt.id, data: { status: "cancelled" } })} data-testid={`button-cancel-${apt.id}`}><X className="h-4 w-4 text-destructive" /></Button>
                          </>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => openEdit(apt)} data-testid={`button-edit-${apt.id}`}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(apt.id)} data-testid={`button-delete-${apt.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </CardHeader>
                    {(apt.reason || apt.patientPhone) && (
                      <CardContent className="pt-0 text-sm text-muted-foreground">
                        {apt.reason && <span>סיבה: {apt.reason}</span>}
                        {apt.reason && apt.patientPhone && <span className="mx-2">|</span>}
                        {apt.patientPhone && <span>טלפון: {apt.patientPhone}</span>}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";
import { Plus, Stethoscope, Trash2, Edit, Calendar } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import type { Visit, InsertVisit, Patient } from "@shared/schema";

export default function VisitsPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  const { data: visits = [], isLoading } = useQuery<Visit[]>({ queryKey: ["/api/visits"] });
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<InsertVisit>({
    defaultValues: { patientId: "", chiefComplaint: "", diagnosis: "", treatment: "", notes: "", followUpDate: null },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertVisit) => apiRequest("POST", "/api/visits", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
      toast({ title: "הביקור נשמר בהצלחה" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה בשמירת ביקור", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertVisit> }) =>
      apiRequest("PATCH", `/api/visits/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
      toast({ title: "הביקור עודכן" });
      setDialogOpen(false);
      setEditingVisit(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה בעדכון ביקור", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/visits/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visits"] });
      toast({ title: "הביקור נמחק" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה במחיקת ביקור", variant: "destructive" });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (editingVisit) {
      updateMutation.mutate({ id: editingVisit.id, data });
    } else {
      createMutation.mutate(data);
    }
  });

  const openEdit = (visit: Visit) => {
    setEditingVisit(visit);
    form.reset({
      patientId: visit.patientId,
      chiefComplaint: visit.chiefComplaint || "",
      diagnosis: visit.diagnosis || "",
      treatment: visit.treatment || "",
      notes: visit.notes || "",
      followUpDate: visit.followUpDate,
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingVisit(null);
    form.reset({ patientId: "", chiefComplaint: "", diagnosis: "", treatment: "", notes: "", followUpDate: null });
    setDialogOpen(true);
  };

  const getPatientName = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : "לא ידוע";
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" data-testid="text-visits-title">ביקורים</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} data-testid="button-add-visit"><Plus className="ml-2 h-4 w-4" />הוסף ביקור</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingVisit ? "עריכת ביקור" : "ביקור חדש"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>מטופל *</Label>
                <Controller name="patientId" control={form.control} rules={{ required: true }} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger data-testid="select-patient"><SelectValue placeholder="בחר מטופל" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </div>
              <div><Label>תלונה עיקרית</Label><Textarea {...form.register("chiefComplaint")} data-testid="input-complaint" /></div>
              <div><Label>אבחנה</Label><Textarea {...form.register("diagnosis")} data-testid="input-diagnosis" /></div>
              <div><Label>טיפול</Label><Textarea {...form.register("treatment")} data-testid="input-treatment" /></div>
              <div><Label>הערות</Label><Textarea {...form.register("notes")} data-testid="input-notes" /></div>
              <div><Label>תאריך מעקב</Label><Input type="date" {...form.register("followUpDate")} data-testid="input-followup" /></div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-visit">
                {editingVisit ? "עדכן" : "שמור"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>טוען...</p>
      ) : visits.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">אין ביקורים</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <Card key={visit.id} data-testid={`card-visit-${visit.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-4">
                  <Stethoscope className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">{getPatientName(visit.patientId)}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(visit.visitDate).toLocaleDateString("he-IL")}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(visit)} data-testid={`button-edit-${visit.id}`}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(visit.id)} data-testid={`button-delete-${visit.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {visit.chiefComplaint && <div><span className="text-sm font-medium">תלונה: </span><span className="text-sm text-muted-foreground">{visit.chiefComplaint}</span></div>}
                {visit.diagnosis && <div><span className="text-sm font-medium">אבחנה: </span><span className="text-sm text-muted-foreground">{visit.diagnosis}</span></div>}
                {visit.treatment && <div><span className="text-sm font-medium">טיפול: </span><span className="text-sm text-muted-foreground">{visit.treatment}</span></div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

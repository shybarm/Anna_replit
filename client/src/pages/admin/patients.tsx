import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";
import { Plus, Search, Trash2, Edit, User } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Patient, InsertPatient } from "@shared/schema";

export default function PatientsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const { data: patients = [], isLoading } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<InsertPatient>({
    defaultValues: { firstName: "", lastName: "", idNumber: "", phone: "", email: "", address: "", allergies: "", notes: "", gender: "", dateOfBirth: null },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPatient) => apiRequest("POST", "/api/patients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "המטופל נוסף בהצלחה" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה ביצירת מטופל", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPatient> }) =>
      apiRequest("PATCH", `/api/patients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "המטופל עודכן בהצלחה" });
      setDialogOpen(false);
      setEditingPatient(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה בעדכון מטופל", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/patients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "המטופל נמחק" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה במחיקת מטופל", variant: "destructive" });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data });
    } else {
      createMutation.mutate(data);
    }
  });

  const openEdit = (patient: Patient) => {
    setEditingPatient(patient);
    form.reset({
      firstName: patient.firstName,
      lastName: patient.lastName,
      idNumber: patient.idNumber,
      phone: patient.phone,
      email: patient.email || "",
      address: patient.address || "",
      allergies: patient.allergies || "",
      notes: patient.notes || "",
      gender: patient.gender || "",
      dateOfBirth: patient.dateOfBirth,
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingPatient(null);
    form.reset({ firstName: "", lastName: "", idNumber: "", phone: "", email: "", address: "", allergies: "", notes: "", gender: "", dateOfBirth: null });
    setDialogOpen(true);
  };

  const filtered = patients.filter(
    (p) => p.firstName.includes(search) || p.lastName.includes(search) || p.idNumber.includes(search) || p.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" data-testid="text-patients-title">מטופלים</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} data-testid="button-add-patient"><Plus className="ml-2 h-4 w-4" />הוסף מטופל</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingPatient ? "עריכת מטופל" : "מטופל חדש"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>שם פרטי *</Label><Input {...form.register("firstName", { required: true })} data-testid="input-first-name" /></div>
                <div><Label>שם משפחה *</Label><Input {...form.register("lastName", { required: true })} data-testid="input-last-name" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>ת.ז. *</Label><Input {...form.register("idNumber", { required: true })} data-testid="input-id-number" /></div>
                <div><Label>טלפון *</Label><Input {...form.register("phone", { required: true })} data-testid="input-phone" /></div>
              </div>
              <div><Label>אימייל</Label><Input type="email" {...form.register("email")} data-testid="input-email" /></div>
              <div><Label>כתובת</Label><Input {...form.register("address")} data-testid="input-address" /></div>
              <div><Label>אלרגיות</Label><Textarea {...form.register("allergies")} data-testid="input-allergies" /></div>
              <div><Label>הערות</Label><Textarea {...form.register("notes")} data-testid="input-notes" /></div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-patient">
                {editingPatient ? "עדכן" : "שמור"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="חיפוש מטופל..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" data-testid="input-search-patient" />
      </div>

      {isLoading ? (
        <p>טוען...</p>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">לא נמצאו מטופלים</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((patient) => (
            <Card key={patient.id} data-testid={`card-patient-${patient.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.firstName} {patient.lastName}</CardTitle>
                    <p className="text-sm text-muted-foreground">ת.ז.: {patient.idNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(patient)} data-testid={`button-edit-patient-${patient.id}`}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(patient.id)} data-testid={`button-delete-patient-${patient.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted-foreground">טלפון:</span> {patient.phone}</div>
                {patient.email && <div><span className="text-muted-foreground">אימייל:</span> {patient.email}</div>}
                {patient.allergies && <div className="col-span-2"><span className="text-muted-foreground">אלרגיות:</span> {patient.allergies}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

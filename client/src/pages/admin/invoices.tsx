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
import { Plus, Receipt, Trash2, Edit, Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import type { Invoice, InsertInvoice, Patient } from "@shared/schema";

const VAT_RATE = 18;

const STATUS_LABELS: Record<string, string> = { pending: "ממתין", paid: "שולם", cancelled: "בוטל" };
const STATUS_COLORS: Record<string, string> = { pending: "secondary", paid: "default", cancelled: "destructive" };

export default function InvoicesPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [subtotal, setSubtotal] = useState(0);

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({ queryKey: ["/api/invoices"] });
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<InsertInvoice>({
    defaultValues: { patientId: "", invoiceNumber: "", description: "", subtotal: "0", vatRate: String(VAT_RATE), vatAmount: "0", total: "0", status: "pending", dueDate: null },
  });

  const vatAmount = (subtotal * VAT_RATE) / 100;
  const total = subtotal + vatAmount;

  const generateInvoiceNumber = () => `INV-${Date.now().toString().slice(-8)}`;

  const createMutation = useMutation({
    mutationFn: (data: InsertInvoice) => apiRequest("POST", "/api/invoices", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "החשבונית נוצרה בהצלחה" });
      setDialogOpen(false);
      form.reset();
      setSubtotal(0);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה ביצירת חשבונית", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertInvoice> }) =>
      apiRequest("PATCH", `/api/invoices/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "החשבונית עודכנה" });
      setDialogOpen(false);
      setEditingInvoice(null);
      form.reset();
      setSubtotal(0);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה בעדכון חשבונית", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "החשבונית נמחקה" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה במחיקת חשבונית", variant: "destructive" });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const invoiceData = {
      ...data,
      subtotal: subtotal.toFixed(2),
      vatRate: String(VAT_RATE),
      vatAmount: vatAmount.toFixed(2),
      total: total.toFixed(2),
    };
    if (editingInvoice) {
      updateMutation.mutate({ id: editingInvoice.id, data: invoiceData });
    } else {
      createMutation.mutate(invoiceData);
    }
  });

  const openEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setSubtotal(parseFloat(invoice.subtotal));
    form.reset({
      patientId: invoice.patientId,
      invoiceNumber: invoice.invoiceNumber,
      description: invoice.description,
      subtotal: invoice.subtotal,
      vatRate: invoice.vatRate,
      vatAmount: invoice.vatAmount,
      total: invoice.total,
      status: invoice.status,
      dueDate: invoice.dueDate,
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingInvoice(null);
    setSubtotal(0);
    form.reset({ patientId: "", invoiceNumber: generateInvoiceNumber(), description: "", subtotal: "0", vatRate: String(VAT_RATE), vatAmount: "0", total: "0", status: "pending", dueDate: null });
    setDialogOpen(true);
  };

  const markAsPaid = (id: string) => {
    updateMutation.mutate({ id, data: { status: "paid", paidDate: new Date() } });
  };

  const getPatientName = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : "לא ידוע";
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" data-testid="text-invoices-title">חשבוניות</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} data-testid="button-add-invoice"><Plus className="ml-2 h-4 w-4" />צור חשבונית</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? "עריכת חשבונית" : "חשבונית חדשה"}</DialogTitle>
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
              <div><Label>מספר חשבונית *</Label><Input {...form.register("invoiceNumber", { required: true })} data-testid="input-invoice-number" /></div>
              <div><Label>תיאור *</Label><Textarea {...form.register("description", { required: true })} data-testid="input-description" /></div>
              <div>
                <Label>סכום לפני מע"מ (₪) *</Label>
                <Input type="number" step="0.01" value={subtotal} onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)} data-testid="input-subtotal" />
              </div>
              <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-md">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">מע"מ ({VAT_RATE}%)</p>
                  <p className="font-semibold">₪{vatAmount.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">סה"כ</p>
                  <p className="font-bold text-lg">₪{total.toFixed(2)}</p>
                </div>
                <div>
                  <Label>סטטוס</Label>
                  <Controller name="status" control={form.control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">ממתין</SelectItem>
                        <SelectItem value="paid">שולם</SelectItem>
                        <SelectItem value="cancelled">בוטל</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-invoice">
                {editingInvoice ? "עדכן" : "שמור"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>טוען...</p>
      ) : invoices.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">אין חשבוניות</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv) => (
            <Card key={inv.id} data-testid={`card-invoice-${inv.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">{inv.invoiceNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">{getPatientName(inv.patientId)}</p>
                  </div>
                  <Badge variant={STATUS_COLORS[inv.status] as any}>{STATUS_LABELS[inv.status]}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="font-bold text-lg">₪{parseFloat(inv.total).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">כולל מע"מ {inv.vatRate}%</p>
                  </div>
                  <div className="flex gap-1">
                    {inv.status === "pending" && (
                      <Button size="icon" variant="ghost" onClick={() => markAsPaid(inv.id)} data-testid={`button-mark-paid-${inv.id}`}><Check className="h-4 w-4 text-green-600" /></Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => openEdit(inv)} data-testid={`button-edit-${inv.id}`}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(inv.id)} data-testid={`button-delete-${inv.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                {inv.description}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

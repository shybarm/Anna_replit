import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Receipt, Activity, Clock } from "lucide-react";
import type { Patient, Appointment, Invoice } from "@shared/schema";

export default function AdminDashboard() {
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });
  const { data: appointments = [] } = useQuery<Appointment[]>({ queryKey: ["/api/appointments"] });
  const { data: invoices = [] } = useQuery<Invoice[]>({ queryKey: ["/api/invoices"] });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + parseFloat(i.total), 0);

  const stats = [
    { title: "מטופלים", value: patients.length, icon: Users, color: "text-blue-600" },
    { title: "תורים להיום", value: todayAppointments.length, icon: Calendar, color: "text-green-600" },
    { title: "חשבוניות ממתינות", value: pendingInvoices.length, icon: Receipt, color: "text-orange-600" },
    { title: "הכנסות (שולם)", value: `₪${totalRevenue.toLocaleString()}`, icon: Activity, color: "text-teal-600" },
  ];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">לוח בקרה</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} data-testid={`card-stat-${i}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-today-appointments">
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>תורים להיום</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground">אין תורים להיום</p>
            ) : (
              <div className="space-y-2">
                {todayAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                    <span className="font-medium">{apt.patientName}</span>
                    <span className="text-muted-foreground">{apt.appointmentTime}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-recent-patients">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle>מטופלים אחרונים</CardTitle>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <p className="text-muted-foreground">אין מטופלים רשומים</p>
            ) : (
              <div className="space-y-2">
                {patients.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                    <span className="font-medium">{p.firstName} {p.lastName}</span>
                    <span className="text-muted-foreground">{p.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";
import { Settings, Save, User } from "lucide-react";
import { useForm } from "react-hook-form";
import type { DoctorSettings, InsertDoctorSettings } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: settings, isLoading } = useQuery<DoctorSettings>({ queryKey: ["/api/settings"] });

  const form = useForm<InsertDoctorSettings>({
    defaultValues: {
      doctorName: "ד״ר אנה ברמלי",
      specialty: "אלרגולוגיה ואימונולוגיה קלינית",
      licenseNumber: "",
      phone: "",
      email: "",
      address: "",
      workingHours: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        doctorName: settings.doctorName,
        specialty: settings.specialty,
        licenseNumber: settings.licenseNumber || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        workingHours: settings.workingHours || "",
        bio: settings.bio || "",
      });
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: (data: InsertDoctorSettings) => apiRequest("PUT", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "ההגדרות נשמרו בהצלחה" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "שגיאה בשמירת הגדרות", variant: "destructive" });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  return (
    <div className="p-6 space-y-6 max-w-3xl" dir="rtl">
      <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-settings-title">
        <Settings className="h-6 w-6" />הגדרות
      </h1>

      <Card data-testid="card-user-info">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <CardTitle>משתמש מחובר</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email || "אין אימייל"}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {user?.firstName} {user?.lastName}
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-doctor-settings">
        <CardHeader>
          <CardTitle>פרטי הרופא והמרפאה</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>טוען...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>שם הרופא</Label>
                  <Input {...form.register("doctorName")} data-testid="input-doctor-name" />
                </div>
                <div>
                  <Label>התמחות</Label>
                  <Input {...form.register("specialty")} data-testid="input-specialty" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>מספר רישיון</Label>
                  <Input {...form.register("licenseNumber")} data-testid="input-license" />
                </div>
                <div>
                  <Label>טלפון</Label>
                  <Input {...form.register("phone")} data-testid="input-phone" />
                </div>
              </div>
              <div>
                <Label>אימייל</Label>
                <Input type="email" {...form.register("email")} data-testid="input-email" />
              </div>
              <div>
                <Label>כתובת</Label>
                <Input {...form.register("address")} data-testid="input-address" />
              </div>
              <div>
                <Label>שעות פעילות</Label>
                <Input {...form.register("workingHours")} placeholder="לדוגמא: ראשון-חמישי 09:00-17:00" data-testid="input-hours" />
              </div>
              <div>
                <Label>אודות</Label>
                <Textarea {...form.register("bio")} rows={4} data-testid="input-bio" />
              </div>
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-settings">
                <Save className="ml-2 h-4 w-4" />שמור הגדרות
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

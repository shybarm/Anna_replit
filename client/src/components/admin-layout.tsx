import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Calendar, Stethoscope, Receipt, Settings, LogOut, Home, User } from "lucide-react";

const navItems = [
  { title: "לוח בקרה", href: "/admin", icon: LayoutDashboard },
  { title: "מטופלים", href: "/admin/patients", icon: Users },
  { title: "תורים", href: "/admin/appointments", icon: Calendar },
  { title: "ביקורים", href: "/admin/visits", icon: Stethoscope },
  { title: "חשבוניות", href: "/admin/invoices", icon: Receipt },
  { title: "הגדרות", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({ title: "לא מורשה", description: "מתחבר מחדש...", variant: "destructive" });
      setTimeout(() => { window.location.href = "/admin/login"; }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <p>טוען...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full" dir="rtl">
        <Sidebar side="right" className="border-l">
          <SidebarHeader className="p-4 border-b">
            <h2 className="font-bold text-lg">ניהול מרפאה</h2>
            <p className="text-sm text-muted-foreground">ד״ר אנה ברמלי</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location === item.href}>
                        <Link href={item.href} data-testid={`link-${item.href.split("/").pop()}`}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="truncate">מנהל</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1" data-testid="link-website">
                <a href="/" target="_blank"><Home className="h-4 w-4 ml-1" />אתר</a>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1" data-testid="button-logout">
                <a href="/api/logout"><LogOut className="h-4 w-4 ml-1" />יציאה</a>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center gap-2 p-2 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ServiceDetail from "@/pages/service-detail";
import LoginPage from "@/pages/admin/login";
import { AdminLayout } from "@/components/admin-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import PatientsPage from "@/pages/admin/patients";
import AppointmentsPage from "@/pages/admin/appointments";
import VisitsPage from "@/pages/admin/visits";
import InvoicesPage from "@/pages/admin/invoices";
import SettingsPage from "@/pages/admin/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services/:id" component={ServiceDetail} />
      <Route path="/admin/login" component={LoginPage} />
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/patients">
        <AdminLayout><PatientsPage /></AdminLayout>
      </Route>
      <Route path="/admin/appointments">
        <AdminLayout><AppointmentsPage /></AdminLayout>
      </Route>
      <Route path="/admin/visits">
        <AdminLayout><VisitsPage /></AdminLayout>
      </Route>
      <Route path="/admin/invoices">
        <AdminLayout><InvoicesPage /></AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout><SettingsPage /></AdminLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

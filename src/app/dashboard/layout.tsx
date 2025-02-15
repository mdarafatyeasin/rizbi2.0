import { ApplicationSidebar } from "@/components/shared/navbar/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SidebarProvider>
        <ApplicationSidebar />
        <main style={{width:"100vw"}}>
          <SidebarTrigger />
          <div className="mt-16">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

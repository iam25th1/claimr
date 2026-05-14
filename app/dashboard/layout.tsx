import { DashboardSidebar } from "@/components/claimr/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-[#FF2D7A]/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 h-96 w-96 rounded-full bg-[#2D6EFF]/5 blur-3xl" />
      </div>

      <DashboardSidebar />

      {/* Main Content */}
      <main className="pl-64">
        <div className="relative min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}

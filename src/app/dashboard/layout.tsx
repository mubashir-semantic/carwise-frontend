import Sidebar from "./_components/Sidebar";
import DashboardHeader from "./_components/DashboardHeader";
import BottomNavigation from "./_components/BottomNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-text-main">
      {/* Top Header */}
      <DashboardHeader />

      {/* Body Area */}
      <div className="flex flex-1 items-start w-full">
        {/* Left Sidebar: Sticky on desktop, hidden on mobile */}
        <aside className="hidden lg:block shrink-0 sticky top-0 self-start">
          <Sidebar />
        </aside>

        {/* Main Content Area (pb-24 ensures bottom nav doesn't cover content on mobile) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

import Sidebar from "./_components/Sidebar";
import DashboardHeader from "./_components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header */}
      <DashboardHeader />

      {/* Body Area */}
      <div className="flex flex-1 items-start">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Center Content (Jahan Dashboard pages render honge) */}
        <main className="flex-1 p-6 w-full">{children}</main>
      </div>
    </div>
  );
}

import HeroBanner from "./_components/HeroBanner";
import StatsCards from "./_components/StatsCards";
import CarStatus from "./_components/CarStatus";
import RightSidebar from "./_components/RightSidebar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full h-full mt-4">
      {/* 1. MIDDLE COLUMN (Main Content) */}
      <div className="flex-1 flex flex-col space-y-6">
        <HeroBanner />
        <StatsCards />
        <CarStatus />
      </div>

      {/* 2. RIGHT COLUMN (Widgets) */}
      <div className="w-full xl:w-[320px] flex flex-col space-y-6">
        <RightSidebar />
      </div>
    </div>
  );
}

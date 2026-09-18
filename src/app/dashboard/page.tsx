import HeroBanner from "./_components/HeroBanner";
import StatsCards from "./_components/StatsCards";
import CarStatus from "./_components/CarStatus";
import RightSidebar from "./_components/RightSidebar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 w-full mt-2 sm:mt-4 min-w-0">
      {/* 1. MIDDLE COLUMN */}
      <div className="flex-1 min-w-0 flex flex-col space-y-6">
        <HeroBanner />
        <StatsCards />
        <CarStatus />
      </div>

      {/* 2. RIGHT COLUMN */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <RightSidebar />
      </div>
    </div>
  );
}

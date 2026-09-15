import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="w-full bg-darkPurple text-white py-4 px-8 flex justify-between items-center z-10">
      {/* Left: Logo */}
      <div className="text-3xl text-brandOrange font-bold tracking-wide">
        CarWise
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex space-x-10 text-[16px] font-light">
        <Link href="#" className="hover:text-brandOrange transition">
          About Us
        </Link>
        <Link href="#" className="hover:text-brandOrange transition">
          Contact Us
        </Link>
      </nav>

      {/* Right: Action Button & Profile */}
      <div className="flex items-center space-x-6">
        <button className="bg-brandOrange text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-opacity-90 transition">
          Get The App
        </button>

        {/* User Profile Area (Dashboard Specific) */}
        <div className="flex items-center space-x-3 cursor-pointer hover:text-brandOrange transition group">
          <div className="w-9 h-9 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center border-2 border-transparent group-hover:border-brandOrange transition">
            <span className="text-xs text-black font-bold">U</span>
          </div>
          <span className="text-sm font-medium">Hi, Ishfaque</span>
        </div>
      </div>
    </header>
  );
}

import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-primary-tint border border-primary/10 rounded-[22px] px-6 sm:px-10 py-7 sm:py-8 flex flex-col md:flex-row items-center w-full min-h-[250px] shadow-xs">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 pointer-events-none z-0">
        <Image
          src="/Ellipse 152.png"
          alt="Background Shape Top Left"
          width={120}
          height={120}
          className="object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <div className="absolute bottom-0 right-0 pointer-events-none z-0">
        <Image
          src="/Ellipse 151.png"
          alt="Background Shape Bottom Right"
          width={177}
          height={166}
          className="object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {/* Left Side: Illustration */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-start">
        <div className="relative w-[280px] sm:w-[320px] h-[190px] sm:h-[220px]">
          <Image
            src="/group 20377.png"
            alt="Easy Servicing Way Illustration"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 320px"
          />
        </div>
      </div>

      {/* Right Side: Text & Button */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-4 md:mt-0">
        <h2 className="text-[26px] sm:text-[30px] font-bold text-text-heading mb-2 leading-tight">
          Easy Servicing Way
        </h2>
        <p className="text-text-secondary text-[13px] sm:text-[14px] mb-5 sm:mb-6 max-w-[280px] leading-relaxed">
          Find your most nearest workshop and book your car done by your phone.
        </p>
        <button className="bg-primary hover:bg-secondary text-white px-7 sm:px-8 py-2.5 rounded-[10px] text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer">
          Book Service
        </button>
      </div>
    </div>
  );
}

import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-[#FFF4E8] rounded-2xl px-10 py-8 flex flex-col md:flex-row items-center w-full h-auto md:h-[260px]">
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
        <div className="relative w-[320px] h-[220px]">
          <Image
            src="/group 20377.png"
            alt="Easy Servicing Way Illustration"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 320px" // <-- Warning fix for 'fill'
          />
        </div>
      </div>

      {/* Right Side: Text & Button */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-0 ">
        <h2 className="text-[32px] font-bold text-darkPurple mb-2 leading-tight">
          Easy Servicing Way
        </h2>
        <p className="text-black text-[14px] mb-6 max-w-[280px] leading-relaxed">
          Find your most nearest workshop and book your car done by your phone.
        </p>
        <button className="bg-brandOrange hover:bg-darkPurple text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          Book Service
        </button>
      </div>
    </div>
  );
}

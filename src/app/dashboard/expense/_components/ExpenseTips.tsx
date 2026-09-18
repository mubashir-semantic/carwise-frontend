import Image from "next/image";

export default function ExpenseTips() {
  return (
    <div className="bg-primary-tint border border-primary/10 rounded-[24px] px-7 sm:px-8 pt-9 pb-8 flex flex-col justify-between relative overflow-hidden min-h-[480px] shadow-xs">
      {/* Background Top-Left Decoration */}
      <div className="absolute top-0 left-0 w-[120px] h-[120px] pointer-events-none z-0">
        <Image
          src="/Ellipse 152 (1).png"
          alt="Background Decoration"
          fill
          className="object-cover"
          sizes="120px"
          priority
        />
      </div>

      {/* Top Section: Icon, Heading & Text */}
      <div className="relative z-10">
        <div className="flex flex-col gap-2 mb-4">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/Vector (1).png"
              alt="Tips Bulb Icon"
              fill
              className="object-contain object-left"
              sizes="32px"
            />
          </div>

          <h3 className="text-text-heading font-bold text-[26px] tracking-tight">
            Tips
          </h3>
        </div>

        <p className="text-text-secondary text-[13.5px] sm:text-[14px] leading-relaxed font-normal max-w-[210px]">
          Checkup your car in a yearly for once at least. Loreum ipsum is dj
          wieh shhd loreum impsum Checkup your car in a yearly for once at
          least. Loreum ipsum is dj wieh shhd loreum impsum .
        </p>
      </div>

      {/* Bottom Section: See more action & Right Illustration */}
      <div className="relative z-10 flex items-end justify-between mt-8">
        <button className="flex items-center gap-3 text-text-heading font-bold text-[15px] sm:text-[16px] hover:text-primary transition-colors cursor-pointer group pb-1">
          <span>See more</span>
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        {/* Character Illustration */}
        <div className="absolute right-[-20px] bottom-[-32px] w-[200px] h-[250px] pointer-events-none">
          <Image
            src="/Group 20410.png"
            alt="Car Checkup Tips Illustration"
            fill
            className="object-contain object-bottom"
            sizes="200px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

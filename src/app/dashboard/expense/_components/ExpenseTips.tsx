import Image from "next/image";

export default function ExpenseTips() {
  return (
    <div className="bg-[#FFF4E8] rounded-[24px] px-8 pt-10 pb-10 flex flex-col justify-between relative overflow-hidden h-full min-h-[460px]">
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
      {/* Top Section: Icon & Compact Title/Text */}
      <div className="relative z-10">
        <div className=" items-center gap-3 mb-5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/Vector (1).png"
              alt="Tips Bulb Icon"
              fill
              className="object-contain object-left"
              sizes="32px"
            />
          </div>

          <h3 className="text-[#29194a] font-bold text-[26px] tracking-tight">
            Tips
          </h3>
        </div>

        <p className="text-gray-600 text-[14px] leading-relaxed font-normal max-w-[210px]">
          Checkup your car in a yearly for once at least. Loreum ipsum is dj
          wieh shhd loreum impsum Checkup your car in a yearly for once at
          least. Loreum ipsum is dj wieh shhd loreum impsum .
        </p>
      </div>
      <div className="relative z-10 flex items-end justify-between mt-10">
        <button className="flex items-center gap-3.5 text-gray-900 font-bold text-[16px] hover:text-brandOrange transition-colors pb-1">
          <span>See more</span>
          <span className="w-9 h-9 rounded-full bg-[#1e1035] text-white flex items-center justify-center text-base shadow-lg transition-transform hover:scale-110">
            ➔
          </span>
        </button>

        <div className="absolute right-[-25px] bottom-[-25px] w-[210px] h-[260px] pointer-events-none">
          <Image
            src="/Group 20410.png"
            alt="Car Checkup Tips Illustration"
            fill
            className="object-contain object-bottom"
            sizes="210px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

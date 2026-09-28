import Image from "next/image";

export default function StatsCards() {
  const stats = [
    {
      id: 1,
      title: "Total Expense",
      value: "24,632Kr",
      image: "/total-exp.png",
      footerText: "View all",
      hasBell: false,
    },
    {
      id: 2,
      title: "Next Servicing date",
      value: "12.3.22",
      image: "/total-exp-1.png",
      footerText: null,
      hasBell: false,
    },
    {
      id: 3,
      title: "Next EU Controll",
      value: "22.02.22",
      image: "/total-exp-2.png",
      footerText: "Remind me",
      hasBell: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-surface px-3.5 sm:px-4 py-3 rounded-[20px] flex items-center gap-3 sm:gap-4 border border-border-main shadow-xs hover:shadow-sm transition-shadow"
        >
          {/* Circular Image Wrapper */}
          <div className="relative w-[70px] h-[70px] sm:w-[82px] sm:h-[82px] shrink-0">
            <Image
              src={stat.image}
              alt={stat.title}
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 70px, 82px"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-text-muted text-[11px] sm:text-[12px] font-medium truncate">
              {stat.title}
            </span>
            <span className="text-text-heading font-bold text-[18px] sm:text-[20px] tracking-tight mt-0.5">
              {stat.value}
            </span>

            {stat.footerText && (
              <span className="text-[12px] sm:text-[13px] text-text-secondary font-medium mt-1 flex items-center">
                {stat.footerText}
                {stat.hasBell && (
                  <span className="ml-1.5 text-primary text-xs">🔔</span>
                )}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white px-3 py-2 rounded-[20px] flex items-center gap-4 border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative w-[90px] h-[90px] flex-shrink-0">
            <Image
              src={stat.image}
              alt={stat.title}
              fill
              className="object-contain object-center"
              sizes="90px" // <-- Yahan sizes add kar diya hai taake terminal warning khatam ho jaye
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-gray-500 text-[12px] font-medium">
              {stat.title}
            </span>
            <span className="text-gray-800 font-bold text-[20px] tracking-tight">
              {stat.value}
            </span>

            {stat.footerText && (
              <span className="text-[14px] text-gray-700 font-medium mt-2 flex items-center">
                {stat.footerText}
                {stat.hasBell && (
                  <span className="ml-1.5 text-brandOrange text-sm">🔔</span>
                )}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

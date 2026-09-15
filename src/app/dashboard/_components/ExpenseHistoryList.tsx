import Image from "next/image";

export default function ExpenseHistoryList() {
  const expenses = [
    {
      id: 1,
      carName: "Mercedez S-Benz(2020)",
      licensee: "Licensee - 1247L3",
      addedDate: "Added Date : 12.02.22",
      image: "/Group 20423.png", // Aap apni car wali image yahan laga sakte hain
    },
    {
      id: 2,
      carName: "Mercedez S-Benz(2020)",
      licensee: "Licensee - 1247L3",
      addedDate: "Added Date : 12.02.22",
      image: "/Group 20423.png",
    },
    {
      id: 3,
      carName: "Mercedez S-Benz(2020)",
      licensee: "Licensee - 1247L3",
      addedDate: "Added Date : 12.02.22",
      image: "/Group 20423.png",
    },
  ];

  return (
    <div className="flex flex-col space-y-5 w-full">
      {expenses.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Left: Car Image & Details */}
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="relative w-[110px] h-[80px] bg-gray-50 rounded-[14px] overflow-hidden flex-shrink-0 border border-gray-100">
              <span className="flex items-center justify-center w-full h-full text-[10px] text-gray-400 font-bold">
                Car Img
              </span>
              Jab image ho toh uncomment karein:
              <Image src={item.image} alt="Car" fill className="object-cover" sizes="110px" /> 
             
            </div>

            <div className="flex flex-col">
              <h4 className="text-gray-900 font-bold text-[16px] mb-1">
                {item.carName}
              </h4>
              <span className="text-gray-500 text-[13px] mb-1 font-medium">
                {item.licensee}
              </span>
              <span className="text-gray-400 text-[12px]">
                {item.addedDate}
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col md:items-end justify-between h-full gap-4 w-full md:w-auto">
            {/* Add Expense History Button */}
            <button className="text-brandOrange hover:bg-brandOrange/10 px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors self-end md:self-auto">
              <span>ADD EXPENSE HISTORY</span>
              <span className="w-4 h-4 rounded-full bg-brandOrange text-white flex items-center justify-center text-xs pb-0.5">
                +
              </span>
            </button>

            {/* View Full History Link */}
            <button className="text-gray-400 hover:text-gray-700 text-[12px] font-medium underline transition-colors self-end md:self-auto">
              View full history
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

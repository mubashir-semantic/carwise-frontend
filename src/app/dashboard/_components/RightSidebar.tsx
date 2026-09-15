import Image from "next/image";

export default function RightSidebar() {
  const newsItems = [
    {
      id: 1,
      text: "",
      image: "/Rectangle 1620.png",
      isChatIcon: false,
    },
    {
      id: 2,
      text: "Hey!!! Your car is ready to pickup! When will u come?",
      image: "",
      isChatIcon: true,
    },
    {
      id: 3,
      text: "We are on your nearest location. Contact with us!!!!",
      image: "/Rectangle 1624.png",
      isChatIcon: false,
    },
    {
      id: 4,
      text: "We are on your nearest location. Contact with us!!!!",
      image: "/Rectangle 1626.png",
      isChatIcon: false,
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-8">
      {" "}
      <div className="relative overflow-hidden bg-[#ff9554] rounded-[20px] p-8 flex flex-col items-center justify-center text-center shadow-sm h-[200px]">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full pointer-events-none"></div>

        <h3 className="relative z-10 text-white font-semibold text-[22px] leading-tight mb-5">
          Expense <br /> History Upload
        </h3>

        <button className="relative z-10 bg-white text-darkPurple px-6 py-2 rounded-[8px] text-[14px] font-semibold flex items-center gap-2 shadow-sm transition-transform hover:scale-105">
          <span>Upload</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </button>
      </div>
      {/* 2. News Section */}
      <div className="flex flex-col">
        {/* Heading & Divider Line */}
        <h3 className="text-gray-900 font-medium text-[18px] mb-3">News</h3>
        <hr className="border-gray-200 mb-5" />

        {/* Cards List */}
        <div className="flex flex-col space-y-4">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-[16px] p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer min-h-[76px]"
            >
              {/* Image / Icon Section */}
              {item.isChatIcon ? (
                // Special Chat Bubble Icon with Red Dot
                <div className="relative w-12 h-12 flex-shrink-0 bg-[#e0f7fa] rounded-full flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#29194a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-[2.5px] border-white"></span>
                </div>
              ) : (
                // Standard Image Box (Ab yahan <Image> tag uncommented aur active hai!)
                <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={item.image}
                    alt="News Image"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}

              {/* Text Section (Sirf tab dikhega agar text majood ho) */}
              {item.text && (
                <p className="text-gray-800 text-[13.5px] leading-snug font-medium">
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

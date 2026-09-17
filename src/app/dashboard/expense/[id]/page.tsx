import React from "react";
import { individualCarServices } from "@/constants/dummyData";

export default function IndividualCarExpenseHistory() {
  return (
    <div className="flex flex-col w-full pb-10 mt-4">
      {/* Header Section: Title & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-[#1a103c] font-bold text-xl sm:text-2xl">
          Mercedez S-Benz (1247L3)
        </h1>

        <div className="flex items-center gap-6 self-start sm:self-auto">
          {/* Share Button */}
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
            Share
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff904d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>

          {/* ADD EXPENSE HISTORY Button */}
          <button className="flex items-center justify-center gap-2 text-[#ff904d] hover:opacity-80 transition-opacity">
            <span className="text-[13px] font-bold uppercase tracking-wide">
              ADD EXPENSE HISTORY
            </span>
            <span className="w-4 h-4 rounded-full bg-[#ff904d] text-white flex items-center justify-center text-[10px] shadow-sm">
              +
            </span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          {/* Table Headers */}
          <thead>
            <tr className="text-[#9ca3af] text-[11px] font-normal uppercase tracking-wider">
              <th className="pb-6 w-[10%]">Category</th>
              <th className="pb-6 w-[25%]">Title</th>
              <th className="pb-6 w-[25%]">Method</th>
              <th className="pb-6 w-[20%]">Date</th>
              <th className="pb-6 w-[10%]">Status</th>
              <th className="pb-6 w-[10%] text-right pr-4">Attachment</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {individualCarServices.map((item, index) => (
              <tr key={index} className="text-[13px] text-gray-800">
                <td className="py-3 font-medium">{item.id}</td>
                <td className="py-3">{item.title}</td>

                {/* Method with custom Red Icon */}
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center font-bold text-[10px]">
                      T
                    </div>
                    <span className="font-medium">{item.method}</span>
                  </div>
                </td>

                <td className="py-3 text-gray-600">{item.date}</td>
                <td className="py-3 font-bold">{item.cost}</td>

                {/* Paperclip Action Icon */}
                <td className="py-3 text-right pr-4">
                  <button className="text-gray-400 hover:text-gray-700 transition-colors inline-block">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}

            {/* Spacer Row for Figma-like gap before footer */}
            <tr>
              <td colSpan={6} className="h-6"></td>
            </tr>
          </tbody>

          {/* Table Footer - Yahan perfectly align ho jayega! */}
          <tfoot className="border-t border-gray-200">
            <tr>
              {/* colspan 4 ka matlab hai ke pehlay 4 columns ko merge kar ke ek bana do */}
              <td
                colSpan={4}
                className="pt-6 text-[#1a103c] font-bold text-[14px]"
              >
                Total cost on this car
              </td>
              {/* Yeh 5th column Status wale column ke theek neechay aayega */}
              <td className="pt-6 text-[#1a103c] font-bold text-[14px]">
                $1311
              </td>
              {/* Yeh 6th column Attachment ke neechay aayega (jo empty chahiye tha) */}
              <td className="pt-6 pr-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

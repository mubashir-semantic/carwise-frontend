import ExpenseHistoryList from "../_components/ExpenseHistoryList";
import ExpenseTips from "../_components/ExpenseTips";

export default function ExpenseHistoryPage() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Page Title */}
      <h1 className="text-gray-900 font-bold text-[22px]">Expense History</h1>

      {/* Main Grid Layout */}
      <div className="flex flex-col xl:flex-row gap-8 w-full items-start">
        {/* Left Side: List of Cars Expense */}
        <div className="flex-1 w-full">
          <ExpenseHistoryList />
        </div>

        {/* Right Side: Tips Widget with Left Border */}
        <div className="w-full xl:w-[360px] border-l border-gray-200 pl-8">
          <ExpenseTips />
        </div>
      </div>
    </div>
  );
}

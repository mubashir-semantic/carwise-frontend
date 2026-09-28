
export interface ExpenseService {
  id: string;
  title: string;
  method: string;
  date: string;
  cost: string;
}

export const individualCarServices: ExpenseService[] = [
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Bildialog Asane",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Manually added",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Manually added",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Manually added",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Bildialog Asane",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Bildialog Asane",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Bildialog Asane",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
  {
    id: "1",
    title: "Replacing car oil tank",
    method: "Bildialog Asane",
    date: "Thu, 20 Feb 2021",
    cost: "$225",
  },
];


// Define the type for Service History
export interface ServiceRecord {
  id: string;
  licenseProblem: string;
  workshopName: string;
  bookingType: string;
  date: string;
  createdDate: string;
  status: "In-progress" | "Completed" | "Pending";
}

// Export the dummy data array
export const serviceHistoryData: ServiceRecord[] = [
  { id: "1", licenseProblem: "#42424 - Car Oil Repair", workshopName: "Bildialog Asane", bookingType: "Pickup & Delivery", date: "Thu, 20 Feb 2021", createdDate: "Created Dec 2020", status: "Completed" },
  { id: "2", licenseProblem: "#42424 - Car Oil Repair", workshopName: "Bildialog Asane", bookingType: "Pickup & Delivery", date: "Thu, 20 Feb 2021", createdDate: "Created Dec 2020", status: "Completed" },
  { id: "3", licenseProblem: "#42424 - Car Oil Repair", workshopName: "Bildialog Asane", bookingType: "Pickup & Delivery", date: "Thu, 20 Feb 2021", createdDate: "Created Dec 2020", status: "Completed" },
  { id: "4", licenseProblem: "#42424 - Car Engine Tuning", workshopName: "Bildialog Asane", bookingType: "Drop-off", date: "Mon, 15 Mar 2021", createdDate: "Created Feb 2021", status: "In-progress" },
  { id: "5", licenseProblem: "#42424 - Brake Pad Replace", workshopName: "Bildialog Asane", bookingType: "Pickup & Delivery", date: "Wed, 10 Apr 2021", createdDate: "Created Mar 2021", status: "Pending" },
];
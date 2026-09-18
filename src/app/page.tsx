import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}

// import Link from "next/link";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import Container from "@/components/Container";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-surface-subtle text-text-main">
//       <Header />

//       <main className="grow flex items-center justify-center py-20">
//         <Container className="flex flex-col items-center text-center max-w-2xl">
//           <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-tint text-primary border border-primary/20 mb-6">
//             Smart Car Maintenance & Expense Tracking
//           </span>

//           <h1 className="text-4xl sm:text-5xl font-extrabold text-text-heading tracking-tight leading-tight mb-4">
//             Manage your vehicles with{" "}
//             <span className="text-primary">CarWise</span>
//           </h1>

//           <p className="text-text-secondary text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
//             Track expenses, manage service records, and schedule repairs all in
//             one unified dashboard.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
//             <Link
//               href="/dashboard"
//               className="w-full sm:w-auto px-8 py-3.5 bg-secondary hover:bg-primary text-white font-semibold text-sm rounded-[10px] transition-all shadow-sm"
//             >
//               Go to Dashboard
//             </Link>
//             <Link
//               href="/login"
//               className="w-full sm:w-auto px-8 py-3.5 bg-surface border border-border-main hover:bg-surface-subtle text-text-heading font-semibold text-sm rounded-[10px] transition-all"
//             >
//               Sign In
//             </Link>
//           </div>
//         </Container>
//       </main>

//       <Footer />
//     </div>
//   );
// }

import FinancesForm from "@/components/FinancesForm";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 text-center">Weekly Finances</h1>
      <FinancesForm />

      <div className="mt-4 flex justify-around">
        <Link href='/' className="bg-green-600 text-white p-4 rounded-full shadow-lg">
          Back to Home
        </Link>

        <Link href='/finances/calendar' className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
          📅 Go to Calendar
        </Link>
      </div>

    </main>
  );
}

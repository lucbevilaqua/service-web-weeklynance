import FinancesForm from "@/components/FinancesForm";

export default function Page() {
  return (
    <main className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 text-center">Weekly Finances</h1>
      <FinancesForm />
    </main>
  );
}

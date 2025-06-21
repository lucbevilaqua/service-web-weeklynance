type Props = { weekTotals: Record<string, Record<string, number>> };

export default function WeeklySummary({ weekTotals }: Props) {
  return (
    <div className="space-y-2">
      {Object.entries(weekTotals).map(([weekStart, cats]) => (
        <div key={weekStart} className="p-2 border rounded bg-gray-50 dark:bg-gray-800">
          <p className="font-semibold">{weekStart} → {Object.entries(cats).map(([c, v]) => `${c}: ${v.toFixed(2)}`).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

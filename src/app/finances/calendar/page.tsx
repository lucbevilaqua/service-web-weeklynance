"use client";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WeeklySummary from "@/components/WeeklySummary";
import { FinanceDb } from "../../api/finance/_models/finances";
import { toast } from "sonner";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type Event = { id: number; title: string; start: Date; end: Date; raw: FinanceDb };

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [weekTotals, setWeekTotals] = useState<Record<string, Record<string, number>>>({});
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetch("/api/finance")
      .then(res => res.json())
      .then(json => {
        const evts = json.data.map((f: FinanceDb) => ({
          id: f.id,
          title: `${f.establishment}: ${f.currency} ${f.amount}`,
          start: new Date(f.created_at),
          end: new Date(f.created_at),
          raw: f,
        }));
        setEvents(evts);
        calculateWeekTotals(evts);
      });
  }, []);

  const deleteData = (evt: Event) => {
    if (confirm(`Delete entry ${evt.title}?`)) {
      fetch(`/api/finance?id=${evt.id}`, { method: "DELETE" })
        .then(r => {
          if (r.ok) {
            toast.success("Deleted!");
            setEvents(prev => prev.filter(e => e.id !== evt.id));
          } else {
            toast.error("Delete failed");
          }
        });
    }
  }

  function calculateWeekTotals(evts: Event[]) {
    const totals: Record<string, Record<string, number>> = {};
    evts.forEach(evt => {
      const weekStart = format(startOfWeek(evt.start), "yyyy-MM-dd");
      totals[weekStart] ||= {};
      const cat = evt.raw.category;
      totals[weekStart][cat] = (totals[weekStart][cat] || 0) + evt.raw.amount;
    });

    setWeekTotals(totals);
  }

  return (
    <main className="p-2">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={Views.MONTH}
        onNavigate={d => setDate(d)}
        style={{ height: "75vh" }}
        onSelectEvent={deleteData}
      />
      <div className="mt-4">
        <WeeklySummary weekTotals={weekTotals} />
      </div>
      <button
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => alert("Will implement Google Sheets export")}
      >
        📤 Export to Google Sheets
      </button>
    </main>
  );
}

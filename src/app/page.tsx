"use client";
import { useEffect, useState } from "react";
import { FinanceSheets } from "@/app/api/finance/_models/finances";
import CalendarWithFinances from "@/components/Calendar";

export default function HomePage() {
  const [events, setEvents] = useState<FinanceSheets[]>([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = () => {
    fetch("/api/finance")
      .then(res => res.json())
      .then(json => {
        const evts = json.data;
        setEvents(evts);
      });
  }

  const handleDeleteEvent = (evt: FinanceSheets) => {
    setEvents(prev => prev.filter(e => e.id !== evt.id));
  }

  return (
    <main className="p-2">
      <CalendarWithFinances events={events} onDeleteEvent={handleDeleteEvent} onCreateNewEvent={getEvents} />
    </main>
  );
}

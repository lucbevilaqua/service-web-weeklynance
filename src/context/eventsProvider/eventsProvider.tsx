"use client";

import { FinanceSheets } from "@/app/api/finance/_models/finances";
import useGetEvents from "@/services/finances/useGetEvents";
import { createContext, useContext, useEffect, useState } from "react";

interface EventsContext {
  deleteEvent: (evt: FinanceSheets) => void
  events: FinanceSheets[]
}

const EventsContext = createContext<EventsContext | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useGetEvents()
  const [events, updateEvents] = useState<FinanceSheets[]>([]);

  useEffect(() => {
    if (data) {
      updateEvents(data)
    }
  }, [data])

  const deleteEvent = (evt: FinanceSheets) => {
    updateEvents(prev => prev.filter(e => e.id !== evt.id));
  }

  return (
    <EventsContext.Provider value={{ events, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEventsContext() {
  const context = useContext(EventsContext);
  if (!context) throw new Error("useEventsContext must be used inside FinanceProvider");
  return context;
}

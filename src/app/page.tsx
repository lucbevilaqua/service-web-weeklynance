"use client";
import CalendarWithFinances from "@/components/Calendar";
import { EventsProvider } from "@/context/eventsProvider/eventsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function HomePage() {

  return (
    <main className="p-2">
      <QueryClientProvider client={queryClient}>
        <EventsProvider>
          <CalendarWithFinances />
        </EventsProvider>
      </QueryClientProvider>
    </main>
  );
}

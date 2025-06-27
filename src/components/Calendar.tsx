"use client"

import React, { Suspense, useEffect, useMemo, useState } from "react"
import { Trash2Icon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card-shadcn"
import { FinanceSheets } from "@/app/api/finance/_models/finances"
import { endOfWeek, format, isSameDay, startOfWeek } from "date-fns"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { EventModal } from "./EventModal"
import { useEventsContext } from "@/context/eventsProvider/eventsProvider"

type WeekResume = Record<string, number>;
type WeekiesResume = Record<string, Record<string, number>>;

function calculateWeekTotals(events: FinanceSheets[]): WeekiesResume {
  const totals: WeekiesResume = {};
  events.forEach(evt => {
    const weekStart = format(startOfWeek(evt.date), "yyyy-MM-dd");
    const weekEnd = format(endOfWeek(evt.date), "yyyy-MM-dd");
    const key = `${weekStart} - ${weekEnd}`;
    totals[key] ||= {};
    const cat = evt.category;
    totals[key][cat] = (totals[key][cat] || 0) + evt.amount;
    totals[key].total = (totals[key].total || 0) + evt.amount;
  });

  return totals;
}

export default function CalendarWithFinances() {
  const { events, deleteEvent } = useEventsContext();
  const [date, setDate] = useState<Date>(new Date());
  const [weekResume, setWeekResume] = useState<WeekResume>();

  const getDayEvents = useMemo((): FinanceSheets[] => events.filter(ev => {
    const eventDate = new Date(ev.date);
    return isSameDay(eventDate, date);
  }), [date, events])

  const weekiesTotal = useMemo(() => calculateWeekTotals(getDayEvents), [getDayEvents]);

  const handleChangeDate = (date: Date) => {
    setDate(date);
    getCurrentWeekResume();
  }

  const getCurrentRangeWeek = useMemo(() => {
    const weekStart = format(startOfWeek(date), "yyyy-MM-dd");
    const weekEnd = format(endOfWeek(date), "yyyy-MM-dd");
    const key = `${weekStart} - ${weekEnd}`;

    return { key, weekStart, weekEnd }
  }, [date])

  const getCurrentWeekResume = () => {
    const { key } = getCurrentRangeWeek;

    const resume = weekiesTotal[key];

    setWeekResume(resume);
  }

  useEffect(() => {
    const { key } = getCurrentRangeWeek;
    const resume = weekiesTotal[key];
    setWeekResume(resume);
  }, [getCurrentRangeWeek, weekiesTotal]);

  const deleteData = (evt: FinanceSheets) => {
    if (confirm(`Delete entry ${evt.establishment}?`)) {
      fetch(`/api/finance/delete?rowNumber=${evt.rowNumber}`, { method: "DELETE" })
        .then(r => {
          if (r.ok) {
            toast.success("Event Deleted!");
            deleteEvent(evt)
          } else {
            toast.error("Delete failed");
          }
        });
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Card className="w-fill py-4">
        <CardContent className="px-4 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleChangeDate}
            className="bg-transparent p-0"
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
          <div className="flex w-full items-center justify-between px-1">
            <div className="text-sm font-medium">
              {date?.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <EventModal date={date} />

          </div>
          <div className="flex w-full flex-col gap-2">
            {
              weekResume &&
              <div
                key='total-week'
                className="bg-blue-500 after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
              >
                <h2 className="font-bold text-white text-lg">Week Resume</h2>
                <h3 className="font-bold text-white">{getCurrentRangeWeek.weekStart} - {getCurrentRangeWeek.weekEnd}</h3>

                <div className="text-amber-50 text-sm">
                  {
                    Object.entries(weekResume).map(([cat, value]) => (
                      <>
                        <span key={cat}>{cat}: {value.formatToCurrency()}</span> <br />
                      </>
                    ))
                  }
                </div>
              </div>
            }

            {
              getDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                >
                  <div className="font-medium">{event.establishment} ({event.amount.formatToCurrency(event.currency)})</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 absolute top-6 right-5"
                    title="Delete Event"
                    onClick={() => deleteData(event)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">Delete Event</span>
                  </Button>
                  <div className="text-muted-foreground text-xs">
                    My Amount: {event.resume.myAmount.formatToCurrency(event.currency)}<br />
                    Home Amount: {event.resume.house.formatToCurrency(event.currency)}<br />
                    Others Amount: {event.resume.others.formatToCurrency(event.currency)}
                  </div>
                </div>
              ))
            }
          </div>
        </CardFooter>
      </Card>
    </Suspense>
  )
}

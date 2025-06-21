/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

interface Props {
  selectedWeek: string;
  onChange: (value: string) => void;
}

const weekRanges: any = {
  week1: [1, 7],
  week2: [8, 14],
  week3: [15, 21],
  week4: [22, 28],
};

export default function WeekSelector({ selectedWeek, onChange }: Props) {
  const [today] = useState(new Date());

  const getWeekDates = (weekKey: string) => {
    const [startDay, endDay] = weekRanges[weekKey];
    const year = today.getFullYear();
    const month = today.getMonth();
    return {
      start: new Date(year, month, startDay),
      end: new Date(year, month, endDay),
    };
  };

  return (
    <div className="mb-4">
      <label className="font-medium">Select Week</label>
      <select
        className="mt-1 w-full border p-2 rounded-md bg-background"
        value={selectedWeek}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="week1">Week 1</option>
        <option value="week2">Week 2</option>
        <option value="week3">Week 3</option>
        <option value="week4">Week 4</option>
      </select>

      <p className="text-sm text-muted-foreground mt-2">
        {
          (() => {
            const { start, end } = getWeekDates(selectedWeek);
            return `From ${start.toDateString()} to ${end.toDateString()}`;
          })()
        }
      </p>
    </div>
  );
}

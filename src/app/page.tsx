"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold">My Finances</h1>
      <div className="w-full max-w-md flex flex-col gap-4">
        <Link href="/finances">
          <div className="p-6 bg-purple-700 text-white rounded-lg text-center text-lg font-medium shadow-md hover:bg-purple-800 transition">
            ➕ Add New Entry
          </div>
        </Link>
        <Link href="/finances/calendar">
          <div className="p-6 bg-blue-600 text-white rounded-lg text-center text-lg font-medium shadow-md hover:bg-blue-700 transition">
            📅 View Calendar
          </div>
        </Link>
      </div>
    </main>
  );
}

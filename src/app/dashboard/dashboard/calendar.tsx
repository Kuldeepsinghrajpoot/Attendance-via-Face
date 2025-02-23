"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function Calendars() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="">

      <Calendar 
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow w-full bg-background"
      />
    </div>
  )
}

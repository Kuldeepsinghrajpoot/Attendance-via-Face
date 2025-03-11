"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { usePathname, useRouter } from "next/navigation";

export function Calendars({ id }: { id: string }) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    // Ensure the correct date without timezone shifts
    const formattedDate = date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0]
        : undefined;

    const router = usePathname();
    const route = useRouter();

    console.log("Formatted Date:", formattedDate); // Debugging

    React.useEffect(() => {
        if (formattedDate) {
            route.push(`${router}?date=${formattedDate}`);
        } else {
            route.push(`${router}`);
        }
    }, [formattedDate]);

    return (
        <div className="">
            <Calendar
                mode="single"
                selected={date}
                onSelect={(selected) => setDate(selected)}
                className="rounded-md border shadow w-full bg-background"
            />
        </div>
    );
}

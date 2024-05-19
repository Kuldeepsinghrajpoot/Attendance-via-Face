"use client"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  const router = usePathname();
  const route = useRouter();
  
  React.useEffect(() => {
    if (date) {
      route.push(`${router}?date=${format(date, "MMM-dd-YYY")}`);
    } else {
  route.push(`${router}?date=${format(new Date(), "MMM-dd-YYY")}`)

    }
    
  });


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        // ref={searchInputRef}
        />
      </PopoverContent>
    </Popover>
  )
}

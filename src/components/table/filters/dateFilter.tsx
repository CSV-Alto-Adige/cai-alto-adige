"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useReset } from "@/store/reset-context";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Filter {
  id: string;
  value: any; // Consider using a more specific type based on your filtering logic
}

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export function DateFilter({ className }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleDateSelection = (selectedRange: DateRange | undefined) => {
    setDate(selectedRange);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (selectedRange?.from && selectedRange?.to) {
      params.set("start", format(selectedRange.from, "yyyy-MM-dd"));
      params.set("end", format(selectedRange.to, "yyyy-MM-dd"));
    } else {
      params.delete("start");
      params.delete("end");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "group relative items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-4 min-w-unit-20 h-unit-10 text-small gap-unit-2 rounded-medium [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none bg-default/40 text-default-foreground data-[hover=true]:opacity-hover z-10 aria-expanded:scale-[0.97] aria-expanded:opacity-70 subpixel-antialiased flex",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: it })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: it })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: it })
              )
            ) : (
              <span>Scegli un periodo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            locale={it}
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelection}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/utils";

// Simple calendar component (you may want to use react-day-picker for a full calendar)
const Calendar = React.forwardRef(({ className, selected, onSelect, ...props }, ref) => {
  return (
    <div className={cn("p-3", className)} ref={ref} {...props}>
      <input
        type="date"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={selected ? new Date(selected).toISOString().split('T')[0] : ''}
        onChange={(e) => onSelect && onSelect(new Date(e.target.value))}
      />
    </div>
  );
});
Calendar.displayName = "Calendar";

export { Calendar };

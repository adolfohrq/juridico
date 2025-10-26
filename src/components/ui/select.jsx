import * as React from "react";
import { cn } from "@/utils";

const Select = React.forwardRef(({ className, children, onValueChange, ...props }, ref) => {
  // Converte onValueChange para onChange para compatibilidade com select HTML nativo
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

const SelectTrigger = Select;
const SelectValue = ({ children, placeholder, ...props }) => children || placeholder || "";
const SelectContent = ({ children, ...props }) => <>{children}</>;
const SelectItem = ({ children, value, ...props }) => <option value={value} {...props}>{children}</option>;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

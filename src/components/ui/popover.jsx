import * as React from "react";
import { cn } from "@/utils";

const Popover = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block" {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

const PopoverTrigger = ({ children, open, setOpen, asChild, ...props }) => {
  const handleClick = () => setOpen && setOpen(!open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

const PopoverContent = ({ children, open, setOpen, className, align = "center", ...props }) => {
  if (!open) return null;

  const alignments = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  };

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        alignments[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };

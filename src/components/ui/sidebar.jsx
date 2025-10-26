import * as React from "react";
import { cn } from "@/utils";

const SidebarContext = React.createContext({ open: true, setOpen: () => {} });

export function SidebarProvider({ children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children, ...props }) {
  const { open } = React.useContext(SidebarContext);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen w-64 transition-all duration-300",
        !open && "w-0 overflow-hidden md:w-16",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex-shrink-0", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({ className, children, ...props }) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex-shrink-0", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({ className, children, ...props }) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ className, children, ...props }) {
  return (
    <div className={cn("text-xs font-semibold", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ className, children, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({ className, children, ...props }) {
  return (
    <nav className={cn("space-y-1", className)} {...props}>
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ className, children, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenuButton({ className, children, asChild, ...props }) {
  const Comp = asChild ? React.Fragment : "button";
  const childProps = asChild ? {} : { className: cn("w-full text-left", className), ...props };

  return asChild ? (
    React.Children.map(children, child =>
      React.cloneElement(child, {
        className: cn(child.props.className, className)
      })
    )
  ) : (
    <Comp {...childProps}>{children}</Comp>
  );
}

export function SidebarTrigger({ className, ...props }) {
  const { open, setOpen } = React.useContext(SidebarContext);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn("p-2", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  );
}

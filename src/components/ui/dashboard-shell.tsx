
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className={cn("flex-1 overflow-hidden", className)}>
      <div className="h-full px-4 py-6 lg:px-8">{children}</div>
    </div>
  );
}

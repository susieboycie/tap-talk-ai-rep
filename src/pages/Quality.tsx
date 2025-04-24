
import { DashboardShell } from "@/components/ui/dashboard-shell";

export default function Quality() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Quality</h1>
          <p className="text-gray-400">Monitor and manage quality metrics</p>
        </div>
      </div>
    </DashboardShell>
  );
}

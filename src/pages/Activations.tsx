
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DocumentViewer } from "@/components/dashboard/document-viewer";

export default function Activations() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Activations</h1>
          <p className="text-gray-400">View and manage activation materials and documents</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <DocumentViewer />
      </div>
    </DashboardShell>
  );
}

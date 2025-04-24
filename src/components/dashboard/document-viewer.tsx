
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const documents = [
  { id: "persona-overview", label: "Persona Overview", path: "/persona-overview.pdf" },
  { id: "cluster-insights", label: "Cluster Insights", path: "/cluster-insights.pdf" },
  { id: "sales-playbook", label: "Sales Playbook", path: "/sales-playbook.pdf" }
];

export function DocumentViewer() {
  const [selectedDoc, setSelectedDoc] = useState(documents[0].path);

  return (
    <Card className="w-full bg-repgpt-700 border-repgpt-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          📄 View Support Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedDoc}
          onValueChange={setSelectedDoc}
        >
          <SelectTrigger className="w-full border-repgpt-600 bg-repgpt-700 text-white">
            <SelectValue placeholder="Choose document" />
          </SelectTrigger>
          <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
            {documents.map((doc) => (
              <SelectItem key={doc.id} value={doc.path}>
                {doc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-repgpt-600 bg-repgpt-800">
          <iframe
            src={selectedDoc}
            className="w-full h-full"
            title="Document Viewer"
          />
        </div>
      </CardContent>
    </Card>
  );
}

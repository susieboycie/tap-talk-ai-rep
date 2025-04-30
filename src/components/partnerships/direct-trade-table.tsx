
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface DirectTradeTableProps {
  data: any[];
}

export function DirectTradeTable({ data }: DirectTradeTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <div className="p-6 text-center">
          <p className="text-gray-400">No performance data available</p>
        </div>
      </Card>
    );
  }

  // Create a flattened representation of all metrics for the table
  const tableData = [
    {
      metric: "Guinness 0.0",
      target: data[0]["GNS 0.0 Target"] || 0,
      achievement: data[0]["GNS 0.0 Ach"] || 0,
      completion: data[0]["GNS 0.0 Target"] 
        ? Math.round((data[0]["GNS 0.0 Ach"] / data[0]["GNS 0.0 Target"]) * 100)
        : 0
    },
    {
      metric: "Rockshore Wave",
      target: data[0]["RS WAVE Target"] || 0,
      achievement: data[0]["RS WAVE Ach"] || 0,
      completion: data[0]["RS WAVE Target"] 
        ? Math.round((data[0]["RS WAVE Ach"] / data[0]["RS WAVE Target"]) * 100)
        : 0
    },
    {
      metric: "Smirnoff Ice",
      target: data[0]["SMICE Target"] || 0,
      achievement: data[0]["SMICE Ach"] || 0,
      completion: data[0]["SMICE Target"] 
        ? Math.round((data[0]["SMICE Ach"] / data[0]["SMICE Target"]) * 100)
        : 0
    },
    {
      metric: "Casamigos",
      target: data[0]["Casa Target"] || 0,
      achievement: data[0]["Casa Ach"] || 0,
      completion: data[0]["Casa Target"] 
        ? Math.round((data[0]["Casa Ach"] / data[0]["Casa Target"]) * 100)
        : 0
    },
    {
      metric: "Days In Trade",
      target: data[0]["DIT Target"] || 0,
      achievement: data[0]["DIT Ach"] || 0,
      completion: data[0]["DIT Target"] 
        ? Math.round((data[0]["DIT Ach"] / data[0]["DIT Target"]) * 100)
        : 0
    },
    {
      metric: "Calls Per Day",
      target: data[0]["CPD Target"] || 0,
      achievement: data[0]["CPD Ach"] || 0,
      completion: data[0]["CPD Target"] 
        ? Math.round((data[0]["CPD Ach"] / data[0]["CPD Target"]) * 100)
        : 0
    },
    {
      metric: "Compliance",
      target: 100,
      achievement: data[0]["Compliance Ach"] || 0,
      completion: data[0]["Compliance Ach"] || 0
    },
    {
      metric: "Rockshore Activations",
      target: "N/A",
      achievement: data[0]["RSL Activations"] || 0,
      completion: "N/A"
    }
  ];

  return (
    <div className="rounded-lg border border-repgpt-700 bg-repgpt-800">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-repgpt-700">
            <TableHead className="text-white">Metric</TableHead>
            <TableHead className="text-white">Target</TableHead>
            <TableHead className="text-white">Achievement</TableHead>
            <TableHead className="text-white">Completion %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow 
              key={index}
              className="border-b border-repgpt-700"
            >
              <TableCell className="text-gray-300 font-medium">{row.metric}</TableCell>
              <TableCell className="text-gray-300">{row.target}</TableCell>
              <TableCell className="text-gray-300">{row.achievement}</TableCell>
              <TableCell className={`${
                typeof row.completion === "number" 
                  ? row.completion >= 100 ? "text-green-400" 
                  : row.completion >= 75 ? "text-yellow-400"
                  : "text-red-400"
                  : "text-gray-300"
              }`}>
                {row.completion === "N/A" ? "N/A" : `${row.completion}%`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

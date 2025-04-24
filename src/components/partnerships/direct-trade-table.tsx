
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface DirectTradeTableProps {
  data: any[];
}

export function DirectTradeTable({ data }: DirectTradeTableProps) {
  return (
    <div className="rounded-lg border border-repgpt-700 bg-repgpt-800">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-repgpt-700">
            <TableHead className="text-white">Product</TableHead>
            <TableHead className="text-white">Fiscal Year/Period</TableHead>
            <TableHead className="text-right text-white">Volume HL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index}
              className="border-b border-repgpt-700"
            >
              <TableCell className="text-gray-300">{row["PRDHA L5 Individual Variant"]}</TableCell>
              <TableCell className="text-gray-300">
                {row["Fiscal year/period"] ? format(new Date(row["Fiscal year/period"]), 'MMM yyyy') : 'N/A'}
              </TableCell>
              <TableCell className="text-right text-gray-300">
                {row["Volume HL"]?.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

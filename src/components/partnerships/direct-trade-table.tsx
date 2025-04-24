
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface DirectTradeTableProps {
  data: any[];
}

export function DirectTradeTable({ data }: DirectTradeTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Get unique products and years
  const uniqueProducts = Array.from(new Set(data.map(row => row["PRDHA L5 Individual Variant"])));
  const uniqueYears = Array.from(new Set(data.map(row => 
    row["Fiscal year/period"] ? format(new Date(row["Fiscal year/period"]), 'yyyy') : null
  ))).filter(Boolean);

  // Filter data
  const filteredData = data.filter(row => {
    const matchesProduct = !selectedProduct || row["PRDHA L5 Individual Variant"] === selectedProduct;
    const matchesYear = !selectedYear || (row["Fiscal year/period"] && 
      format(new Date(row["Fiscal year/period"]), 'yyyy') === selectedYear);
    return matchesProduct && matchesYear;
  });

  return (
    <div className="rounded-lg border border-repgpt-700 bg-repgpt-800">
      <div className="p-4 flex gap-4">
        <div className="w-[200px]">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-products">All Products</SelectItem>
              {uniqueProducts.map(product => (
                <SelectItem key={product} value={product || "unknown"}>{product || "Unknown Product"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-years">All Years</SelectItem>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year || "unknown"}>{year || "Unknown Year"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-repgpt-700">
            <TableHead className="text-white">Product</TableHead>
            <TableHead className="text-white">Fiscal Year/Period</TableHead>
            <TableHead className="text-right text-white">Volume HL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow 
              key={index}
              className="border-b border-repgpt-700"
            >
              <TableCell className="text-gray-300">{row["PRDHA L5 Individual Variant"] || "Unknown Product"}</TableCell>
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

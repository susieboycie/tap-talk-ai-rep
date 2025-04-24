
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOutletSales } from "@/hooks/use-outlet-sales";

interface SalesKPITableProps {
  selectedOutlet: string;
}

export function SalesKPITable({ selectedOutlet }: SalesKPITableProps) {
  const { data: salesData, isLoading } = useOutletSales(selectedOutlet);

  if (isLoading) {
    return <div className="text-gray-400">Loading sales data...</div>;
  }

  if (!salesData || salesData.length === 0) {
    return <div className="text-gray-400">No sales data available for this outlet.</div>;
  }

  return (
    <div className="rounded-lg border border-repgpt-700 bg-repgpt-800">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-repgpt-700">
            <TableHead className="text-white">Product</TableHead>
            <TableHead className="text-white">Fiscal Year</TableHead>
            <TableHead className="text-right text-white">Volume HL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.map((row, index) => {
            const products = [
              { name: 'Carlsberg Lager In Keg', value: row.Carlsberg_Lager_In_Keg_MTD_Billed },
              { name: 'Guinness Draught In Keg', value: row.Guinness_Draught_In_Keg_MTD_Billed },
              { name: 'Smithwick\'s In Keg', value: row.Smithwicks_In_Keg_MTD_Billed },
              { name: 'Guinness Draught 0.0 In Keg', value: row["Guinness_Draught_0.0_in_Keg_MTD_Billed"] },
              { name: 'Rockshore In Keg', value: row.Rockshore_in_Keg_MTD_Billed },
              { name: 'Rockshore Apple Cider In Keg', value: row.Rockshore_Apple_Cider_in_Keg_MTD_Billed }
            ];

            return products.map((product, productIndex) => (
              product.value != null && (
                <TableRow 
                  key={`${index}-${productIndex}`}
                  className="border-b border-repgpt-700"
                >
                  <TableCell className="text-gray-300">{product.name}</TableCell>
                  <TableCell className="text-gray-300">
                    {row.Calendar_day ? new Date(row.Calendar_day).getFullYear() : 'N/A'}
                  </TableCell>
                  <TableCell className={`text-right ${product.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.value.toFixed(1)}
                  </TableCell>
                </TableRow>
              )
            )).filter(Boolean);
          })}
        </TableBody>
      </Table>
    </div>
  );
}

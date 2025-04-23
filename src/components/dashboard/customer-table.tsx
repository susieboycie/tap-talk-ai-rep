
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const customers = [
  {
    id: "1",
    name: "The Fox & Hound",
    lastContact: "2 days ago",
    status: "Active",
    volume: "120 kegs/month",
    tapOpportunity: "High",
  },
  {
    id: "2",
    name: "The Royal Oak",
    lastContact: "1 week ago",
    status: "Warning",
    volume: "85 kegs/month",
    tapOpportunity: "Medium",
  },
  {
    id: "3",
    name: "The Black Swan",
    lastContact: "3 days ago",
    status: "Active",
    volume: "105 kegs/month",
    tapOpportunity: "Low",
  },
  {
    id: "4",
    name: "The White Horse",
    lastContact: "2 weeks ago",
    status: "At Risk",
    volume: "65 kegs/month",
    tapOpportunity: "High",
  },
  {
    id: "5",
    name: "The Red Lion",
    lastContact: "5 days ago",
    status: "Active",
    volume: "95 kegs/month",
    tapOpportunity: "Medium",
  },
];

export function CustomerTable() {
  return (
    <Card className="col-span-3 border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-white">Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-repgpt-700">
              <TableHead className="text-gray-300">Customer</TableHead>
              <TableHead className="text-gray-300">Last Contact</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Volume</TableHead>
              <TableHead className="text-gray-300">Tap Opportunity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-repgpt-700">
                <TableCell className="font-medium">
                  <Link 
                    to={`/customers/${customer.id}`} 
                    className="text-white hover:text-repgpt-400 hover:underline"
                  >
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell>{customer.lastContact}</TableCell>
                <TableCell>
                  <Badge variant={
                    customer.status === "Active" ? "default" : 
                    customer.status === "Warning" ? "outline" : "destructive"
                  }>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.volume}</TableCell>
                <TableCell>
                  <Badge variant={
                    customer.tapOpportunity === "High" ? "default" : 
                    customer.tapOpportunity === "Medium" ? "outline" : "secondary"
                  }>
                    {customer.tapOpportunity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

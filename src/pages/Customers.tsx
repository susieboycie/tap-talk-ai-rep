
import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Search, Users } from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";

// Mock customer data
const customers = [
  {
    id: "1",
    name: "The Fox & Hound",
    address: "123 Main Street, London",
    contactName: "John Smith",
    phone: "+44 20 1234 5678",
    status: "Active",
    volume: "120 kegs/month",
    lastContact: "Apr 21, 2023",
  },
  {
    id: "2",
    name: "The Royal Oak",
    address: "45 High Street, Manchester",
    contactName: "Emma Johnson",
    phone: "+44 16 1234 5678",
    status: "Warning",
    volume: "85 kegs/month",
    lastContact: "Apr 15, 2023",
  },
  {
    id: "3",
    name: "The Black Swan",
    address: "78 Bridge Road, Birmingham",
    contactName: "Michael Brown",
    phone: "+44 12 1234 5678",
    status: "Active",
    volume: "105 kegs/month",
    lastContact: "Apr 19, 2023",
  },
  {
    id: "4",
    name: "The White Horse",
    address: "12 Park Lane, Glasgow",
    contactName: "Sarah Wilson",
    phone: "+44 14 1234 5678",
    status: "At Risk",
    volume: "65 kegs/month",
    lastContact: "Apr 8, 2023",
  },
  {
    id: "5",
    name: "The Red Lion",
    address: "34 Queen Street, Edinburgh",
    contactName: "David Taylor",
    phone: "+44 13 1234 5678",
    status: "Active",
    volume: "95 kegs/month",
    lastContact: "Apr 17, 2023",
  },
  {
    id: "6",
    name: "The Crown",
    address: "56 Castle Road, Liverpool",
    contactName: "Laura Davies",
    phone: "+44 15 1234 5678",
    status: "Active",
    volume: "110 kegs/month",
    lastContact: "Apr 20, 2023",
  },
  {
    id: "7",
    name: "The George",
    address: "89 Abbey Lane, Bristol",
    contactName: "Robert Evans",
    phone: "+44 11 1234 5678",
    status: "Warning",
    volume: "75 kegs/month",
    lastContact: "Apr 14, 2023",
  },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customers</h1>
          <p className="text-gray-400">Manage and view your customer accounts</p>
        </div>
        <Button 
          className="bg-repgpt-400 hover:bg-repgpt-500 text-white"
          onClick={() => setIsAssistantOpen(true)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask RepGPT
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            className="pl-8 bg-repgpt-700 border-repgpt-600 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="ml-4 bg-repgpt-400 hover:bg-repgpt-500 text-white">
          <Users className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card className="border-repgpt-700 bg-repgpt-800">
        <div className="rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-repgpt-700">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Contact</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Volume</TableHead>
                <TableHead className="text-gray-300">Last Contact</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-repgpt-700">
                  <TableCell className="font-medium">
                    <Link 
                      to={`/customers/${customer.id}`} 
                      className="text-white hover:text-repgpt-400 hover:underline"
                    >
                      {customer.name}
                    </Link>
                    <div className="text-sm text-gray-400">{customer.address}</div>
                  </TableCell>
                  <TableCell>
                    <div>{customer.contactName}</div>
                    <div className="text-sm text-gray-400">{customer.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      customer.status === "Active" ? "default" : 
                      customer.status === "Warning" ? "outline" : "destructive"
                    }>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.volume}</TableCell>
                  <TableCell>{customer.lastContact}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild className="h-8 border-repgpt-700 text-white hover:bg-repgpt-700">
                        <Link to={`/customers/${customer.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 border-repgpt-700 text-white hover:bg-repgpt-700">
                        Call
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </DashboardShell>
  );
}

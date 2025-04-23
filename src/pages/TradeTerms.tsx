
import { useState } from "react";
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
import { MessageSquare, Search, FileText, AlertCircle } from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";

// Mock trade terms data
const tradeTerms = [
  {
    id: "1",
    customer: "The Fox & Hound",
    startDate: "Jan 1, 2023",
    endDate: "Dec 31, 2023",
    status: "Active",
    daysRemaining: 253,
    complianceStatus: "Compliant",
    volume: "120 kegs/month",
    rebate: "5%"
  },
  {
    id: "2",
    customer: "The Royal Oak",
    startDate: "Mar 15, 2023",
    endDate: "Mar 14, 2024",
    status: "Active",
    daysRemaining: 327,
    complianceStatus: "At Risk",
    volume: "85 kegs/month",
    rebate: "3%"
  },
  {
    id: "3",
    customer: "The Black Swan",
    startDate: "Sep 1, 2022",
    endDate: "Aug 31, 2023",
    status: "Expiring Soon",
    daysRemaining: 45,
    complianceStatus: "Compliant",
    volume: "105 kegs/month",
    rebate: "4%"
  },
  {
    id: "4",
    customer: "The White Horse",
    startDate: "May 1, 2023",
    endDate: "Apr 30, 2024",
    status: "Active",
    daysRemaining: 374,
    complianceStatus: "Non-compliant",
    volume: "65 kegs/month",
    rebate: "2%"
  },
  {
    id: "5",
    customer: "The Red Lion",
    startDate: "Feb 15, 2023",
    endDate: "Feb 14, 2024",
    status: "Active",
    daysRemaining: 299,
    complianceStatus: "Compliant",
    volume: "95 kegs/month",
    rebate: "4%"
  },
  {
    id: "6",
    customer: "The Crown",
    startDate: "Nov 1, 2022",
    endDate: "Oct 31, 2023",
    status: "Expiring Soon",
    daysRemaining: 76,
    complianceStatus: "At Risk",
    volume: "110 kegs/month",
    rebate: "5%"
  },
  {
    id: "7",
    customer: "The George",
    startDate: "Jul 1, 2022",
    endDate: "Jun 30, 2023",
    status: "Expired",
    daysRemaining: 0,
    complianceStatus: "Expired",
    volume: "75 kegs/month",
    rebate: "3%"
  },
];

export default function TradeTerms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const filteredTerms = tradeTerms.filter(term => 
    term.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Trade Terms</h1>
          <p className="text-gray-400">Monitor and manage customer contracts and trade agreements</p>
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
            placeholder="Search terms..."
            className="pl-8 bg-repgpt-700 border-repgpt-600 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="ml-4 bg-repgpt-400 hover:bg-repgpt-500 text-white">
          <FileText className="mr-2 h-4 w-4" />
          New Agreement
        </Button>
      </div>

      {/* Expiring Soon Alert */}
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
        <div>
          <h3 className="text-yellow-200 font-medium">Attention Required</h3>
          <p className="text-yellow-100 text-sm">
            There are 2 agreements expiring in the next 90 days. Review and prepare renewal options.
          </p>
        </div>
      </div>

      <Card className="border-repgpt-700 bg-repgpt-800">
        <div className="rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-repgpt-700">
                <TableHead className="text-gray-300">Customer</TableHead>
                <TableHead className="text-gray-300">Period</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Compliance</TableHead>
                <TableHead className="text-gray-300">Volume Target</TableHead>
                <TableHead className="text-gray-300">Rebate</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTerms.map((term) => (
                <TableRow key={term.id} className="hover:bg-repgpt-700">
                  <TableCell className="font-medium text-white">
                    {term.customer}
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{term.startDate} - {term.endDate}</div>
                    <div className="text-sm text-gray-400">
                      {term.daysRemaining === 0 ? "Expired" : `${term.daysRemaining} days remaining`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      term.status === "Active" ? "default" : 
                      term.status === "Expiring Soon" ? "outline" : 
                      "secondary"
                    }>
                      {term.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      term.complianceStatus === "Compliant" ? "default" : 
                      term.complianceStatus === "At Risk" ? "outline" : 
                      term.complianceStatus === "Expired" ? "secondary" :
                      "destructive"
                    }>
                      {term.complianceStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{term.volume}</TableCell>
                  <TableCell className="text-white">{term.rebate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8 border-repgpt-700 text-white hover:bg-repgpt-700">
                        View
                      </Button>
                      {(term.status === "Expiring Soon" || term.status === "Expired") && (
                        <Button size="sm" className="h-8 bg-repgpt-400 hover:bg-repgpt-500 text-white">
                          Renew
                        </Button>
                      )}
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


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
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { useTradeTerms } from "@/hooks/use-trade-terms";
import { useOutlet } from "@/contexts/outlet-context";

export default function TradeTerms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const { data: tradeTerms = [], isLoading } = useTradeTerms(selectedOutlet);
  
  const filteredTerms = tradeTerms.filter(term => 
    term.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get count of agreements expiring soon for alert
  const expiringCount = tradeTerms.filter(term => term.status === "Expiring Soon").length;

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
        <div className="w-[240px] mx-4">
          <OutletSelector />
        </div>
        <Button className="bg-repgpt-400 hover:bg-repgpt-500 text-white">
          <FileText className="mr-2 h-4 w-4" />
          New Agreement
        </Button>
      </div>

      {/* Expiring Soon Alert */}
      {expiringCount > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-yellow-200 font-medium">Attention Required</h3>
            <p className="text-yellow-100 text-sm">
              There {expiringCount === 1 ? 'is' : 'are'} {expiringCount} agreement{expiringCount === 1 ? '' : 's'} expiring in the next 90 days. Review and prepare renewal options.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading trade terms data...</p>
        </div>
      )}

      {!isLoading && !selectedOutlet && (
        <div className="text-center py-8">
          <p className="text-gray-400">Please select an outlet to view its trade terms.</p>
        </div>
      )}

      {!isLoading && selectedOutlet && filteredTerms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No trade terms data available for this outlet.</p>
        </div>
      )}

      {!isLoading && filteredTerms.length > 0 && (
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
      )}

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </DashboardShell>
  );
}

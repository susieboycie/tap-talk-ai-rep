
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CreditCard, BarChart3, FileText } from "lucide-react";
import { ContractData } from "@/hooks/use-contract-data";
import { format } from "date-fns";

interface ContractSummaryCardProps {
  data: ContractData[];
}

export function ContractSummaryCard({ data }: ContractSummaryCardProps) {
  // Group contracts by status
  const activeContracts = data.filter(contract => contract.Status === "Active");
  const expiringContracts = data.filter(contract => contract.Status === "Expiring Soon");
  const expiredContracts = data.filter(contract => contract.Status === "Expired");
  
  // Calculate total investment across all active contracts
  const totalInvestment = activeContracts.reduce(
    (sum, contract) => sum + (contract["Overall Investment(incl. Indirect Inv)"] || 0), 
    0
  );
  
  // Calculate total forecast volume across all active contracts
  const totalForecastVolume = activeContracts.reduce(
    (sum, contract) => sum + (contract["Forecast Volume"] || 0), 
    0
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      {/* Top row of cards - rearranged to be in a single row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-blue-500/20 bg-blue-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-400">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/20 p-2">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">{activeContracts.length}</h3>
                <p className="text-sm text-gray-400">Current agreements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-amber-400">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-500/20 p-2">
                <CreditCard className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">€{Math.round(totalInvestment).toLocaleString()}</h3>
                <p className="text-sm text-gray-400">Across all active contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-400">Forecast Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/20 p-2">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">{totalForecastVolume.toFixed(1)} HL</h3>
                <p className="text-sm text-gray-400">Total volume commitment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Contract details table - now expanded with full width */}
      {data.length > 0 && (
        <Card className="border-repgpt-700 bg-repgpt-800 w-full">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.map((contract, index) => (
                <div key={index} className="border border-repgpt-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-semibold">{contract["Product Name"]}</h3>
                    <Badge variant={
                      contract.Status === "Active" ? "default" : 
                      contract.Status === "Expiring Soon" ? "outline" : 
                      "secondary"
                    }>
                      {contract.Status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Period:</span>
                      <span className="text-white">{formatDate(contract["Contract Start Date"])} - {formatDate(contract["Contract End Date"])}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Agreement:</span>
                      <span className="text-white">{contract["Agreement Type"] || "Standard"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Investment:</span>
                      <span className="text-white">€{Math.round(contract["Overall Investment(incl. Indirect Inv)"] || 0).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Forecast Volume:</span>
                      <span className="text-white">{(contract["Forecast Volume"] || 0).toFixed(1)} HL</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

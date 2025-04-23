
import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MessageSquare, Calculator, BarChart, PieChart } from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";

const initialCustomers = [
  { id: "1", name: "The Fox & Hound", currentVolume: 120, potentialIncrease: 15 },
  { id: "2", name: "The Royal Oak", currentVolume: 85, potentialIncrease: 20 },
  { id: "3", name: "The Black Swan", currentVolume: 105, potentialIncrease: 10 },
  { id: "4", name: "The White Horse", currentVolume: 65, potentialIncrease: 25 },
  { id: "5", name: "The Red Lion", currentVolume: 95, potentialIncrease: 15 },
];

export default function ScenarioPlanning() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("1");
  const [volumeIncrease, setVolumeIncrease] = useState(10);
  const [discountRate, setDiscountRate] = useState(5);
  const [incentiveAmount, setIncentiveAmount] = useState(500);
  
  // Get selected customer data
  const selectedCustomerData = initialCustomers.find(c => c.id === selectedCustomer);
  const currentVolume = selectedCustomerData?.currentVolume || 0;
  
  // Calculate new volume
  const newVolume = currentVolume * (1 + volumeIncrease / 100);
  
  // Calculate financials
  const avgPricePerKeg = 120;
  const avgCostPerKeg = 50;
  const avgMarginPerKeg = avgPricePerKeg - avgCostPerKeg;
  
  const currentRevenue = currentVolume * avgPricePerKeg;
  const currentCost = currentVolume * avgCostPerKeg;
  const currentProfit = currentRevenue - currentCost;
  
  const discountedPrice = avgPricePerKeg * (1 - discountRate / 100);
  const newRevenue = newVolume * discountedPrice;
  const newCost = newVolume * avgCostPerKeg + parseInt(incentiveAmount);
  const newProfit = newRevenue - newCost;
  
  const profitDifference = newProfit - currentProfit;
  const profitIncreasePercentage = (profitDifference / currentProfit) * 100;
  
  // Chart data
  const comparisonData = [
    { name: "Revenue", current: currentRevenue, new: newRevenue },
    { name: "Cost", current: currentCost, new: newCost },
    { name: "Profit", current: currentProfit, new: newProfit },
  ];
  
  const volumeComparisonData = [
    { name: "Current", volume: currentVolume },
    { name: "Projected", volume: newVolume },
  ];

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Scenario Planning</h1>
          <p className="text-gray-400">
            Simulate different sales scenarios to optimize profitability
          </p>
        </div>
        <Button 
          className="bg-repgpt-400 hover:bg-repgpt-500 text-white"
          onClick={() => setIsAssistantOpen(true)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask RepGPT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-repgpt-700 bg-repgpt-800">
          <CardHeader>
            <CardTitle className="text-white">Scenario Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-white">Select Customer</Label>
              <Select 
                value={selectedCustomer} 
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger className="bg-repgpt-700 border-repgpt-600 text-white">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="bg-repgpt-700 border-repgpt-600 text-white">
                  {initialCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id} className="focus:bg-repgpt-600 focus:text-white">
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volumeIncrease" className="text-white">Volume Increase (%)</Label>
                <span className="text-white font-medium">{volumeIncrease}%</span>
              </div>
              <Slider
                id="volumeIncrease"
                min={0}
                max={50}
                step={1}
                value={[volumeIncrease]}
                onValueChange={(values) => setVolumeIncrease(values[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="discountRate" className="text-white">Discount Rate (%)</Label>
                <span className="text-white font-medium">{discountRate}%</span>
              </div>
              <Slider
                id="discountRate"
                min={0}
                max={20}
                step={1}
                value={[discountRate]}
                onValueChange={(values) => setDiscountRate(values[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incentive" className="text-white">Incentive Amount (£)</Label>
              <Input
                id="incentive"
                type="number"
                value={incentiveAmount}
                onChange={(e) => setIncentiveAmount(e.target.value)}
                className="bg-repgpt-700 border-repgpt-600 text-white"
              />
            </div>

            <Button className="w-full bg-repgpt-400 hover:bg-repgpt-500 text-white">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Scenario
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-repgpt-700 bg-repgpt-800">
          <CardHeader>
            <CardTitle className="text-white">Scenario Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="summary">
              <TabsList className="bg-repgpt-700 mb-4">
                <TabsTrigger value="summary" className="data-[state=active]:bg-repgpt-400">Summary</TabsTrigger>
                <TabsTrigger value="charts" className="data-[state=active]:bg-repgpt-400">Charts</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-repgpt-400">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Card className="border-repgpt-700 bg-repgpt-700">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <PieChart className="h-6 w-6 text-repgpt-400 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">Profit Difference</h3>
                        <div className="text-3xl font-bold mt-2 text-white">
                          £{Math.round(profitDifference).toLocaleString()}
                        </div>
                        <div className={`text-sm mt-1 ${profitIncreasePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitIncreasePercentage >= 0 ? '↑' : '↓'} {Math.abs(Math.round(profitIncreasePercentage))}% from current
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-repgpt-700 bg-repgpt-700">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <BarChart className="h-6 w-6 text-repgpt-400 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">Volume Increase</h3>
                        <div className="text-3xl font-bold mt-2 text-white">
                          {Math.round(newVolume - currentVolume)} kegs
                        </div>
                        <div className="text-sm mt-1 text-green-400">
                          ↑ {volumeIncrease}% from current
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-repgpt-700 bg-repgpt-700">
                  <CardContent className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-repgpt-800 border-b border-repgpt-600">
                          <TableHead className="text-gray-300">Metric</TableHead>
                          <TableHead className="text-right text-gray-300">Current</TableHead>
                          <TableHead className="text-right text-gray-300">New</TableHead>
                          <TableHead className="text-right text-gray-300">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-repgpt-800 border-b border-repgpt-600">
                          <TableCell className="font-medium text-white">Volume (kegs)</TableCell>
                          <TableCell className="text-right text-white">{currentVolume}</TableCell>
                          <TableCell className="text-right text-white">{Math.round(newVolume)}</TableCell>
                          <TableCell className="text-right text-green-400">+{Math.round(newVolume - currentVolume)}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-repgpt-800 border-b border-repgpt-600">
                          <TableCell className="font-medium text-white">Revenue (£)</TableCell>
                          <TableCell className="text-right text-white">£{Math.round(currentRevenue).toLocaleString()}</TableCell>
                          <TableCell className="text-right text-white">£{Math.round(newRevenue).toLocaleString()}</TableCell>
                          <TableCell className={`text-right ${newRevenue > currentRevenue ? 'text-green-400' : 'text-red-400'}`}>
                            {newRevenue > currentRevenue ? '+' : ''}£{Math.round(newRevenue - currentRevenue).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-repgpt-800 border-b border-repgpt-600">
                          <TableCell className="font-medium text-white">Cost (£)</TableCell>
                          <TableCell className="text-right text-white">£{Math.round(currentCost).toLocaleString()}</TableCell>
                          <TableCell className="text-right text-white">£{Math.round(newCost).toLocaleString()}</TableCell>
                          <TableCell className={`text-right ${newCost > currentCost ? 'text-red-400' : 'text-green-400'}`}>
                            {newCost > currentCost ? '+' : ''}£{Math.round(newCost - currentCost).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-repgpt-800">
                          <TableCell className="font-medium text-white">Profit (£)</TableCell>
                          <TableCell className="text-right text-white">£{Math.round(currentProfit).toLocaleString()}</TableCell>
                          <TableCell className="text-right text-white">£{Math.round(newProfit).toLocaleString()}</TableCell>
                          <TableCell className={`text-right font-bold ${newProfit > currentProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {newProfit > currentProfit ? '+' : ''}£{Math.round(newProfit - currentProfit).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="charts">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="border-repgpt-700 bg-repgpt-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Financial Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={comparisonData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                              itemStyle={{ color: "#fff" }}
                              labelStyle={{ color: "#fff" }}
                            />
                            <Legend />
                            <Bar dataKey="current" name="Current" fill="#6d28d9" />
                            <Bar dataKey="new" name="Projected" fill="#9b87f5" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-repgpt-700 bg-repgpt-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Volume Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={volumeComparisonData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                              itemStyle={{ color: "#fff" }}
                              labelStyle={{ color: "#fff" }}
                            />
                            <Bar dataKey="volume" name="Volume (kegs)" fill="#9b87f5" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <Card className="border-repgpt-700 bg-repgpt-700">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Scenario Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Customer</h4>
                          <p className="text-white">{selectedCustomerData?.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Current Volume</h4>
                          <p className="text-white">{currentVolume} kegs/month</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Average Price per Keg</h4>
                          <p className="text-white">£{avgPricePerKeg}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Average Cost per Keg</h4>
                          <p className="text-white">£{avgCostPerKeg}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Average Margin per Keg</h4>
                          <p className="text-white">£{avgMarginPerKeg}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Discounted Price per Keg</h4>
                          <p className="text-white">£{Math.round(discountedPrice)}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-repgpt-600">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Scenario Parameters</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-xs text-gray-400 mb-1">Volume Increase</h5>
                            <p className="text-white">{volumeIncrease}%</p>
                          </div>
                          <div>
                            <h5 className="text-xs text-gray-400 mb-1">Discount Rate</h5>
                            <p className="text-white">{discountRate}%</p>
                          </div>
                          <div>
                            <h5 className="text-xs text-gray-400 mb-1">Incentive Amount</h5>
                            <p className="text-white">£{incentiveAmount}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-repgpt-600">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Recommendations</h4>
                        <ul className="list-disc list-inside text-white space-y-2">
                          <li>
                            This scenario would result in a 
                            <span className={profitIncreasePercentage >= 0 ? ' text-green-400' : ' text-red-400'}>
                              {' '}{profitIncreasePercentage >= 0 ? 'profit increase' : 'profit decrease'}{' '}
                              of {Math.abs(Math.round(profitIncreasePercentage))}%
                            </span>
                          </li>
                          <li>
                            {profitIncreasePercentage >= 10 ? 
                              'This is a highly favorable scenario and should be pursued.' : 
                              profitIncreasePercentage >= 0 ? 
                                'This scenario is profitable but consider optimizing further.' : 
                                'This scenario is not recommended due to negative profit impact.'
                            }
                          </li>
                          {discountRate > 10 && (
                            <li className="text-yellow-400">
                              The discount rate is quite high, consider reducing it for better margins.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </DashboardShell>
  );
}

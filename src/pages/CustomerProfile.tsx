
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart as RechartsBarChart, Bar } from "recharts";
import { MessageSquare, ArrowLeft, Phone, Mail, FileText, BarChart } from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";
import { Badge } from "@/components/ui/badge";

// Mock data
const customerData = {
  id: "1",
  name: "The Fox & Hound",
  address: "123 Main Street, London",
  phone: "+44 20 1234 5678",
  email: "manager@foxandhound.com",
  accountManager: "Jane Smith",
  status: "Active",
  lastContact: "Apr 21, 2023",
  nextMeeting: "Apr 28, 2023",
  volumeData: [
    { month: "Jan", volume: 110, target: 100, industry: 95 },
    { month: "Feb", volume: 105, target: 100, industry: 97 },
    { month: "Mar", volume: 115, target: 105, industry: 98 },
    { month: "Apr", volume: 120, target: 110, industry: 100 },
    { month: "May", volume: 118, target: 115, industry: 102 },
    { month: "Jun", volume: 125, target: 120, industry: 105 },
  ],
  productMix: [
    { name: "Premium Lager", value: 40 },
    { name: "IPA", value: 25 },
    { name: "Stout", value: 15 },
    { name: "Cider", value: 12 },
    { name: "Ale", value: 8 },
  ],
  tapData: [
    { id: 1, position: "Bar 1 - Left", product: "House Lager", status: "Active" },
    { id: 2, position: "Bar 1 - Center", product: "Guest IPA", status: "Rotating" },
    { id: 3, position: "Bar 1 - Right", product: "Premium Stout", status: "Active" },
    { id: 4, position: "Bar 2 - Left", product: "House IPA", status: "Active" },
    { id: 5, position: "Bar 2 - Center", product: "Cider", status: "Active" },
    { id: 6, position: "Bar 2 - Right", product: "Vacant", status: "Available" },
  ],
  tradeTerms: {
    contractStart: "Jan 1, 2023",
    contractEnd: "Dec 31, 2023",
    minimumVolume: "1,200 kegs/year",
    rebateStructure: "5% at 100 kegs/month, 7% at 150 kegs/month",
    specialConditions: "Exclusive pouring rights for premium lager category",
    complianceStatus: "On track"
  }
};

export default function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // In a real app, we'd fetch this based on the ID
  const customer = customerData;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild className="bg-transparent border-repgpt-700 text-white hover:bg-repgpt-700">
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{customer.name}</h1>
            <p className="text-gray-400">{customer.address}</p>
          </div>
        </div>
        <Button 
          className="bg-repgpt-400 hover:bg-repgpt-500 text-white"
          onClick={() => setIsAssistantOpen(true)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask RepGPT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-repgpt-700 bg-repgpt-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-white">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-white">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-white">Account Manager: {customer.accountManager}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-repgpt-700 bg-repgpt-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge>{customer.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Contact:</span>
                <span className="text-white">{customer.lastContact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Next Meeting:</span>
                <span className="text-white">{customer.nextMeeting}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-repgpt-700 bg-repgpt-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="border-repgpt-700 text-white justify-start hover:bg-repgpt-700">
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="border-repgpt-700 text-white justify-start hover:bg-repgpt-700">
                <BarChart className="mr-2 h-4 w-4" />
                Run Scenario
              </Button>
              <Button variant="outline" className="border-repgpt-700 text-white justify-start hover:bg-repgpt-700">
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-repgpt-700">
          <TabsTrigger value="performance" className="data-[state=active]:bg-repgpt-400">Performance</TabsTrigger>
          <TabsTrigger value="tap-visibility" className="data-[state=active]:bg-repgpt-400">Tap Visibility</TabsTrigger>
          <TabsTrigger value="trade-terms" className="data-[state=active]:bg-repgpt-400">Trade Terms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card className="border-repgpt-700 bg-repgpt-800">
            <CardHeader>
              <CardTitle className="text-white">Volume Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={customer.volumeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="volume" stroke="#9b87f5" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="target" stroke="#ff7300" />
                    <Line type="monotone" dataKey="industry" stroke="#00bcd4" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-repgpt-700 bg-repgpt-800">
            <CardHeader>
              <CardTitle className="text-white">Product Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={customer.productMix}
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
                    <Bar dataKey="value" name="Percentage" fill="#9b87f5" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tap-visibility">
          <Card className="border-repgpt-700 bg-repgpt-800">
            <CardHeader>
              <CardTitle className="text-white">Tap Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-repgpt-700">
                      <th className="text-left py-3 px-4 text-gray-300">Position</th>
                      <th className="text-left py-3 px-4 text-gray-300">Current Product</th>
                      <th className="text-left py-3 px-4 text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.tapData.map((tap) => (
                      <tr key={tap.id} className="border-b border-repgpt-700">
                        <td className="py-3 px-4 text-white">{tap.position}</td>
                        <td className="py-3 px-4 text-white">{tap.product}</td>
                        <td className="py-3 px-4">
                          <Badge variant={
                            tap.status === "Active" ? "default" :
                            tap.status === "Rotating" ? "outline" : "secondary"
                          }>
                            {tap.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline" className="h-8 border-repgpt-700 text-white hover:bg-repgpt-700">
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trade-terms">
          <Card className="border-repgpt-700 bg-repgpt-800">
            <CardHeader>
              <CardTitle className="text-white">Current Trade Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Contract Period</h3>
                    <p className="text-white">
                      {customer.tradeTerms.contractStart} - {customer.tradeTerms.contractEnd}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Minimum Volume Commitment</h3>
                    <p className="text-white">{customer.tradeTerms.minimumVolume}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Rebate Structure</h3>
                    <p className="text-white">{customer.tradeTerms.rebateStructure}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Special Conditions</h3>
                    <p className="text-white">{customer.tradeTerms.specialConditions}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Compliance Status</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
                        {customer.tradeTerms.complianceStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-repgpt-400 hover:bg-repgpt-500 text-white">
                      Generate Renewal Options
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </DashboardShell>
  );
}

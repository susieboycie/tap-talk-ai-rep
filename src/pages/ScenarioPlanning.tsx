import React, { useState } from 'react';
import { DashboardShell } from '@/components/ui/dashboard-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { BarChart, LineChart, Thermometer, Calculator } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart as ReLineChart, Line 
} from 'recharts';

// Fixed the sample data format to match TypeScript requirements
const data = [
  { name: 'Jan', current: 4000, proposed: 4400 },
  { name: 'Feb', current: 3000, proposed: 3300 },
  { name: 'Mar', current: 2000, proposed: 2400 },
  { name: 'Apr', current: 2780, proposed: 3908 },
  { name: 'May', current: 1890, proposed: 4800 },
  { name: 'Jun', current: 2390, proposed: 3800 },
];

export default function ScenarioPlanning() {
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [volumeIncrease, setVolumeIncrease] = useState<number>(15);
  
  // Fixed the handlers to ensure correct typing
  const handleDiscountChange = (value: number[]) => {
    setDiscountPercentage(value[0]);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolumeIncrease(value[0]);
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Scenario Planning</h1>
          <p className="text-gray-400">Plan and simulate different sales strategies</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="border-repgpt-700 bg-repgpt-800 col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Volume Impact Simulator</CardTitle>
            <CardDescription className="text-gray-400">
              Simulate the impact of different discount rates on product volumes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account" className="text-white">Product</Label>
                <Select defaultValue="guinness">
                  <SelectTrigger className="bg-repgpt-700 border-repgpt-600 text-white">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
                    <SelectItem value="guinness">Guinness</SelectItem>
                    <SelectItem value="smirnoff">Smirnoff</SelectItem>
                    <SelectItem value="baileys">Baileys</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Account Type</Label>
                <Select defaultValue="on">
                  <SelectTrigger className="bg-repgpt-700 border-repgpt-600 text-white">
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
                    <SelectItem value="on">On-Premise</SelectItem>
                    <SelectItem value="off">Off-Premise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="discount" className="text-white">Discount Percentage</Label>
                <span className="text-white font-bold">{discountPercentage}%</span>
              </div>
              <Slider
                defaultValue={[10]}
                max={30}
                step={1}
                onValueChange={handleDiscountChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume" className="text-white">Expected Volume Increase</Label>
                <span className="text-white font-bold">{volumeIncrease}%</span>
              </div>
              <Slider
                defaultValue={[15]}
                max={50}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="competitive" />
              <Label htmlFor="competitive" className="text-white">Include competitive response in model</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-repgpt-400 hover:bg-repgpt-500">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate ROI
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-repgpt-700 bg-repgpt-800">
          <CardHeader>
            <CardTitle className="text-white">Scenario Results</CardTitle>
            <CardDescription className="text-gray-400">
              Financial impact of current settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3">
              <div className="grid grid-cols-2 items-center">
                <span className="text-gray-400">Revenue Impact:</span>
                <span className="text-green-500 font-bold">+€10,450</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="text-gray-400">Volume Impact:</span>
                <span className="text-green-500 font-bold">+1,240 units</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="text-gray-400">Margin Change:</span>
                <span className="text-red-500 font-bold">-2.4%</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="text-gray-400">Market Share:</span>
                <span className="text-green-500 font-bold">+1.2%</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="text-gray-400">Break-even Period:</span>
                <span className="text-white font-bold">3 months</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="text-gray-400">ROI:</span>
                <span className="text-green-500 font-bold">124%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-repgpt-700 pt-4">
            <Button variant="outline" className="border-repgpt-600 text-repgpt-400 hover:text-white hover:bg-repgpt-700">Save</Button>
            <Button className="bg-repgpt-400 hover:bg-repgpt-500">Share</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="border-repgpt-700 bg-repgpt-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Projected Performance</CardTitle>
              <Tabs defaultValue="bar">
                <TabsList className="bg-repgpt-700">
                  <TabsTrigger value="bar" className="data-[state=active]:bg-repgpt-600">
                    <BarChart className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="line" className="data-[state=active]:bg-repgpt-600">
                    <LineChart className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription className="text-gray-400">
              Comparison of current vs. proposed strategy impacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <TabsContent value="bar" className="mt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar dataKey="current" name="Current Strategy" fill="#6c5dd3" />
                      <Bar dataKey="proposed" name="Proposed Strategy" fill="#00d2c6" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="line" className="mt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="current" name="Current Strategy" stroke="#6c5dd3" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="proposed" name="Proposed Strategy" stroke="#00d2c6" activeDot={{ r: 8 }} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

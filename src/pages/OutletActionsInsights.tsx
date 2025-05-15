import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOutlet } from "@/contexts/outlet-context";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Circle, Clock, CheckCircle, XCircle, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO, isToday, isThisWeek, isThisMonth, subDays } from "date-fns";

// Types
interface Action {
  id: string;
  text: string;
  completed: boolean;
  outlet_name: string;
  created_at: string;
  updated_at: string;
}

interface ActionStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

interface OutletSummary {
  outlet_name: string;
  action_count: number;
  completed_count: number;
  completion_rate: number;
}

interface TimeRange {
  label: string;
  value: string;
  filter: (date: Date) => boolean;
}

const OutletActionsInsights = () => {
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<ActionStats>({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [outletSummaries, setOutletSummaries] = useState<OutletSummary[]>([]);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [recentActionsByDay, setRecentActionsByDay] = useState<any[]>([]);
  
  const timeRanges: TimeRange[] = [
    { label: "All Time", value: "all", filter: () => true },
    { label: "Today", value: "today", filter: (date) => isToday(date) },
    { label: "This Week", value: "week", filter: (date) => isThisWeek(date) },
    { label: "This Month", value: "month", filter: (date) => isThisMonth(date) },
    { label: "Last 30 Days", value: "30days", filter: (date) => new Date() > date && date > subDays(new Date(), 30) }
  ];

  // Fetch actions data
  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      try {
        let query = supabase.from('outlet_actions').select('*');
        
        if (selectedOutlet) {
          query = query.eq('outlet_name', selectedOutlet);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching actions:", error);
          return;
        }
        
        if (data) {
          const formattedActions = data.map(item => ({
            id: item.id,
            text: item.text,
            completed: item.completed,
            outlet_name: item.outlet_name,
            created_at: item.created_at,
            updated_at: item.updated_at
          }));
          setActions(formattedActions);
          calculateStats(formattedActions);
          generateDailyActionData(formattedActions);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [selectedOutlet]);

  // Calculate statistics based on filtered actions
  const calculateStats = (actionData: Action[]) => {
    const filteredActions = filterActionsByTimeRange(actionData);
    const total = filteredActions.length;
    const completed = filteredActions.filter(action => action.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats({ total, completed, pending, completionRate });

    // Generate outlet summaries
    const outlets: { [key: string]: OutletSummary } = {};
    filteredActions.forEach(action => {
      if (!outlets[action.outlet_name]) {
        outlets[action.outlet_name] = {
          outlet_name: action.outlet_name,
          action_count: 0,
          completed_count: 0,
          completion_rate: 0
        };
      }
      
      outlets[action.outlet_name].action_count += 1;
      if (action.completed) {
        outlets[action.outlet_name].completed_count += 1;
      }
    });
    
    // Calculate completion rates
    const summaries = Object.values(outlets).map(outlet => {
      outlet.completion_rate = outlet.action_count > 0 
        ? Math.round((outlet.completed_count / outlet.action_count) * 100) 
        : 0;
      return outlet;
    });
    
    // Sort by action count (descending)
    summaries.sort((a, b) => b.action_count - a.action_count);
    setOutletSummaries(summaries);
  };

  // Filter actions by selected time range
  const filterActionsByTimeRange = (actionData: Action[]) => {
    const selectedRange = timeRanges.find(range => range.value === timeRange);
    if (!selectedRange || timeRange === 'all') return actionData;
    
    return actionData.filter(action => {
      const actionDate = parseISO(action.created_at);
      return selectedRange.filter(actionDate);
    });
  };

  // Generate daily action data for charts
  const generateDailyActionData = (actionData: Action[]) => {
    const today = new Date();
    const days: {[key: string]: {date: string, completed: number, pending: number}} = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');
      days[dateString] = {
        date: format(date, 'MMM dd'),
        completed: 0,
        pending: 0
      };
    }
    
    // Fill with actual data
    actionData.forEach(action => {
      const actionDate = format(parseISO(action.created_at), 'yyyy-MM-dd');
      if (days[actionDate]) {
        if (action.completed) {
          days[actionDate].completed += 1;
        } else {
          days[actionDate].pending += 1;
        }
      }
    });
    
    // Convert to array for chart
    const dailyData = Object.values(days);
    setRecentActionsByDay(dailyData);
  };

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    calculateStats(actions);
    generateDailyActionData(actions);
  };

  // Colors for charts
  const COLORS = ['#10B981', '#EF4444'];

  // Pie chart data
  const pieChartData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending }
  ];

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Outlet Actions Insights</h1>
          <p className="text-gray-400">
            Visual analytics for outlet actions progress and trends
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <OutletSelector />
        </div>
      </div>

      {/* Time range filter */}
      <div className="mb-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <ListFilter className="h-5 w-5" />
                <span className="font-medium">Time Period:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeRangeChange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Actions</CardDescription>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Circle className="h-5 w-5 text-blue-500" />
              {stats.total}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Completed Actions</CardDescription>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {stats.completed}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Pending Actions</CardDescription>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              {stats.pending}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Completion Rate</CardDescription>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              {stats.completionRate}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart className="h-5 w-5" />
              Actions Completion Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of completed vs pending actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {loading ? (
                <p className="text-gray-400">Loading chart data...</p>
              ) : stats.total === 0 ? (
                <p className="text-gray-400">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} actions`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart className="h-5 w-5" />
              Actions Over Time (Last 7 Days)
            </CardTitle>
            <CardDescription className="text-gray-400">
              Daily breakdown of actions created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <p className="text-gray-400">Loading chart data...</p>
              ) : recentActionsByDay.length === 0 ? (
                <p className="text-gray-400">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
                    data={recentActionsByDay}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#2a2a2a', borderColor: '#444' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" stackId="a" fill="#10B981" />
                    <Bar dataKey="pending" name="Pending" stackId="a" fill="#EF4444" />
                  </ReBarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outlet performance table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart className="h-5 w-5" />
            Outlet Action Performance
          </CardTitle>
          <CardDescription className="text-gray-400">
            Completion metrics by outlet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading outlet data...</p>
          ) : outletSummaries.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No outlet data available</p>
          ) : (
            <div className="rounded overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="px-4 py-2 text-white">Outlet Name</th>
                    <th className="px-4 py-2 text-white text-center">Total Actions</th>
                    <th className="px-4 py-2 text-white text-center">Completed</th>
                    <th className="px-4 py-2 text-white text-center">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {outletSummaries.map((outlet, index) => (
                    <tr 
                      key={index} 
                      className={`text-white ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}
                    >
                      <td className="px-4 py-3">
                        <Button 
                          variant="link" 
                          className="p-0 font-normal text-white hover:text-blue-400"
                          onClick={() => setSelectedOutlet(outlet.outlet_name)}
                        >
                          {outlet.outlet_name}
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-center">{outlet.action_count}</td>
                      <td className="px-4 py-3 text-center">{outlet.completed_count}</td>
                      <td className="px-4 py-3 text-center">
                        <span 
                          className={`px-2 py-1 rounded text-xs ${
                            outlet.completion_rate >= 75 ? 'bg-green-900/30 text-green-400' : 
                            outlet.completion_rate >= 50 ? 'bg-yellow-900/30 text-yellow-400' : 
                            'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {outlet.completion_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default OutletActionsInsights;

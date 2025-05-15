
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOutlet } from "@/contexts/outlet-context";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Circle, Clock, CheckCircle, XCircle, ListFilter, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO, isToday, isThisWeek, isThisMonth, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays } from "date-fns";
import { ActionsTable } from "@/components/dashboard/actions-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

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

interface TimeRange {
  label: string;
  value: string;
  filter: (date: Date) => boolean;
  getDateRange: () => { start: Date, end: Date };
}

type ActionFilter = 'all' | 'completed' | 'pending';

const Actions = () => {
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const [actions, setActions] = useState<Action[]>([]);
  const [displayedActions, setDisplayedActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<ActionStats>({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [timeRange, setTimeRange] = useState<string>("all");
  const [recentActionsByDay, setRecentActionsByDay] = useState<any[]>([]);
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  
  const today = new Date();
  
  const timeRanges: TimeRange[] = [
    { 
      label: "All Time", 
      value: "all", 
      filter: () => true,
      getDateRange: () => ({ 
        start: new Date(0), // Beginning of time
        end: today 
      })
    },
    { 
      label: "Today", 
      value: "today", 
      filter: (date) => isToday(date),
      getDateRange: () => ({ 
        start: startOfDay(today),
        end: endOfDay(today)
      })
    },
    { 
      label: "This Week", 
      value: "week", 
      filter: (date) => isThisWeek(date),
      getDateRange: () => ({ 
        start: startOfWeek(today),
        end: endOfWeek(today)
      })
    },
    { 
      label: "This Month", 
      value: "month", 
      filter: (date) => isThisMonth(date),
      getDateRange: () => ({ 
        start: startOfMonth(today),
        end: endOfMonth(today)
      })
    },
    { 
      label: "Last 30 Days", 
      value: "30days", 
      filter: (date) => new Date() > date && date > subDays(new Date(), 30),
      getDateRange: () => ({ 
        start: subDays(today, 30),
        end: today
      })
    }
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
          applyFilters(formattedActions, actionFilter, timeRange);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [selectedOutlet]);

  // Apply filters to the actions
  const applyFilters = (actionData: Action[], filter: ActionFilter, selectedTimeRange: string) => {
    const filteredByTime = filterActionsByTimeRange(actionData, selectedTimeRange);
    let result = filteredByTime;
    
    if (filter === 'completed') {
      result = filteredByTime.filter(action => action.completed);
    } else if (filter === 'pending') {
      result = filteredByTime.filter(action => !action.completed);
    }
    
    setDisplayedActions(result);
  };

  // Calculate statistics based on filtered actions
  const calculateStats = (actionData: Action[]) => {
    const filteredActions = filterActionsByTimeRange(actionData, timeRange);
    const total = filteredActions.length;
    const completed = filteredActions.filter(action => action.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats({ total, completed, pending, completionRate });
  };

  // Filter actions by selected time range
  const filterActionsByTimeRange = (actionData: Action[], selectedTimeRange: string) => {
    const selectedRange = timeRanges.find(range => range.value === selectedTimeRange);
    if (!selectedRange || selectedTimeRange === 'all') return actionData;
    
    return actionData.filter(action => {
      const actionDate = parseISO(action.created_at);
      return selectedRange.filter(actionDate);
    });
  };

  // Generate daily action data for charts based on selected time range
  const generateDailyActionData = (actionData: Action[]) => {
    // Get the selected time range configuration
    const selectedRange = timeRanges.find(range => range.value === timeRange) || timeRanges[0];
    
    // Get the date range for the selected time period
    const { start, end } = selectedRange.getDateRange();
    
    // Filter actions by the selected time range
    const filteredActions = filterActionsByTimeRange(actionData, timeRange);
    
    // Create an array of days in the date range
    const daysInRange = eachDayOfInterval({ start, end });
    
    // Initialize data for each day
    const days: {[key: string]: {date: string, completed: number, pending: number}} = {};
    
    // For "all time" with too many days, we'll sample a reasonable number of days
    const maxSampleDays = 30;
    let daysToUse = daysInRange;
    
    if (timeRange === 'all' && daysInRange.length > maxSampleDays) {
      // For "all time", show the last 30 days instead of all days
      daysToUse = Array.from({ length: maxSampleDays }).map((_, i) => 
        subDays(today, maxSampleDays - 1 - i));
    }
    
    // Initialize each day in the range with zero counts
    daysToUse.forEach(day => {
      const dateString = format(day, 'yyyy-MM-dd');
      days[dateString] = {
        date: format(day, 'MMM dd'),
        completed: 0,
        pending: 0
      };
    });
    
    // Fill with actual data
    filteredActions.forEach(action => {
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
    applyFilters(actions, actionFilter, value);
  };

  // Handle action filter change
  const handleActionFilterChange = (filter: ActionFilter) => {
    setActionFilter(filter);
    applyFilters(actions, filter, timeRange);
  };

  // Toggle action completion status
  const handleToggleComplete = async (id: string) => {
    try {
      // Find the action and toggle its state
      const action = actions.find(a => a.id === id);
      if (!action) return;

      const newStatus = !action.completed;
      
      // Update in Supabase
      const { error } = await supabase
        .from('outlet_actions')
        .update({ 
          completed: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error("Error updating action:", error);
        toast({
          title: "Error",
          description: "Failed to update action status",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      const updatedActions = actions.map(a => 
        a.id === id ? { ...a, completed: newStatus, updated_at: new Date().toISOString() } : a
      );
      
      setActions(updatedActions);
      calculateStats(updatedActions);
      generateDailyActionData(updatedActions);
      applyFilters(updatedActions, actionFilter, timeRange);

      toast({
        title: "Success",
        description: `Action marked as ${newStatus ? 'completed' : 'pending'}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Delete an action
  const handleDeleteAction = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('outlet_actions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting action:", error);
        toast({
          title: "Error",
          description: "Failed to delete action",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      const updatedActions = actions.filter(a => a.id !== id);
      setActions(updatedActions);
      calculateStats(updatedActions);
      generateDailyActionData(updatedActions);
      applyFilters(updatedActions, actionFilter, timeRange);

      toast({
        title: "Success",
        description: "Action deleted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Colors for charts
  const COLORS = ['#10B981', '#EF4444'];

  // Pie chart data
  const pieChartData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending }
  ];

  // Get the title for the time range chart
  const getTimeRangeChartTitle = () => {
    switch (timeRange) {
      case 'today':
        return 'Actions Today';
      case 'week':
        return 'Actions This Week';
      case 'month':
        return 'Actions This Month';
      case '30days':
        return 'Actions Over Last 30 Days';
      default:
        return 'Actions Over Time';
    }
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Actions</h1>
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
              {getTimeRangeChartTitle()}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of actions by day
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

      {/* Actions list with filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart className="h-5 w-5" />
                Action Items
              </CardTitle>
              <CardDescription className="text-gray-400">
                List of all actions with status information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400 mr-2">Status:</span>
              <div className="flex gap-2">
                <Badge 
                  className={`cursor-pointer ${actionFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => handleActionFilterChange('all')}
                >
                  All
                </Badge>
                <Badge 
                  className={`cursor-pointer ${actionFilter === 'completed' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => handleActionFilterChange('completed')}
                >
                  Completed
                </Badge>
                <Badge 
                  className={`cursor-pointer ${actionFilter === 'pending' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => handleActionFilterChange('pending')}
                >
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading actions...</p>
          ) : (
            <ActionsTable 
              actions={displayedActions} 
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteAction}
            />
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default Actions;

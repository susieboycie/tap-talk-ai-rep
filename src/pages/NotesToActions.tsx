
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Edit, Check, Clipboard, ClipboardList, Building, Table } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOutlet } from "@/contexts/outlet-context";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionsTable } from "@/components/dashboard/actions-table";

interface Action {
  id: string;
  text: string;
  completed: boolean;
  outlet_name?: string;
  created_at: string;
  updated_at: string;
}

const NotesToActions = () => {
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const { user } = useAuth();
  const [notes, setNotes] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [outlets, setOutlets] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("cards");

  // Fetch available outlets
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const { data, error } = await supabase
          .from('outlet_data')
          .select('\"Outlet Name\"')
          .order('\"Outlet Name\"');
        
        if (error) {
          console.error("Error fetching outlets:", error);
          return;
        }
        
        if (data) {
          const outletNames = data.map(item => item["Outlet Name"]).filter(Boolean) as string[];
          setOutlets(outletNames);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchOutlets();
  }, []);

  // Fetch actions for the current outlet
  useEffect(() => {
    const fetchActions = async () => {
      setIsLoading(true);
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
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, [selectedOutlet]);

  // Separate notes into actionable items
  const processNotes = async () => {
    if (!notes.trim()) {
      toast({
        title: "Empty notes",
        description: "Please enter some notes to convert to actions.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOutlet) {
      toast({
        title: "No outlet selected",
        description: "Please select an outlet before creating actions.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simple processing: split by line breaks and filter empty lines
    const noteLines = notes
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    try {
      const newActions = [];
      
      for (const text of noteLines) {
        const { data, error } = await supabase
          .from('outlet_actions')
          .insert({
            outlet_name: selectedOutlet,
            text,
            completed: false
          })
          .select()
          .single();
          
        if (error) {
          console.error("Error inserting action:", error);
          continue;
        }
        
        if (data) {
          newActions.push({
            id: data.id,
            text: data.text,
            completed: data.completed,
            outlet_name: data.outlet_name,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
        }
      }
      
      setActions([...newActions, ...actions]);
      setNotes("");
      
      toast({
        title: "Notes processed",
        description: `${newActions.length} action items created for ${selectedOutlet}.`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create action items.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleActionCompletion = async (id: string) => {
    const action = actions.find(action => action.id === id);
    if (!action) return;
    
    const newCompletedState = !action.completed;
    
    try {
      console.log(`Updating action ${id} to completed=${newCompletedState}`);
      
      const { error } = await supabase
        .from('outlet_actions')
        .update({ 
          completed: newCompletedState,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating action:", error);
        toast({
          title: "Error",
          description: "Failed to update action status.",
          variant: "destructive",
        });
        return;
      }
      
      // Only update the UI if the database update was successful
      setActions(
        actions.map(action =>
          action.id === id ? { ...action, completed: newCompletedState } : action
        )
      );
      
      toast({
        title: "Action updated",
        description: newCompletedState ? "Action marked as completed." : "Action reopened.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update action status.",
        variant: "destructive",
      });
    }
  };

  const deleteAction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('outlet_actions')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting action:", error);
        return;
      }
      
      setActions(actions.filter(action => action.id !== id));
      toast({
        title: "Action removed",
        description: "The action item has been removed."
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Notes to Actions</h1>
          <p className="text-gray-400">
            Convert your outlet notes into actionable tasks
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <OutletSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-repgpt-700 border-repgpt-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Edit className="h-5 w-5" />
              Notes
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your notes here. Each line will become a separate action item.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your notes here..."
              className="h-[300px] bg-repgpt-800 border-repgpt-600 text-white"
            />
          </CardContent>
          <CardFooter>
            <Button 
              onClick={processNotes}
              disabled={isProcessing || !notes.trim() || !selectedOutlet}
              className="w-full"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Convert to Actions
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-repgpt-700 border-repgpt-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clipboard className="h-5 w-5" />
              Action Items
            </CardTitle>
            <CardDescription className="text-gray-400">
              {selectedOutlet 
                ? `Showing actions for ${selectedOutlet}` 
                : "Select an outlet to view actions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <p className="text-center text-gray-400 py-10">Loading actions...</p>
              ) : actions.length === 0 ? (
                <p className="text-center text-gray-400 py-10">No action items found. Convert your notes to get started.</p>
              ) : (
                actions.map((action) => (
                  <div 
                    key={action.id} 
                    className="flex items-start gap-2 p-3 bg-repgpt-800 rounded-md border border-repgpt-600"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full p-1 ${action.completed ? 'bg-green-900/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}
                      onClick={() => toggleActionCompletion(action.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <p className={`text-sm ${action.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                        {action.text}
                      </p>
                      {action.outlet_name && (
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Building className="h-3 w-3 mr-1" />
                          {action.outlet_name}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-white"
                      onClick={() => deleteAction(action.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">
              {actions.filter(a => a.completed).length} of {actions.length} actions completed
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* All Actions Table */}
      <Card className="bg-repgpt-700 border-repgpt-600">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Table className="h-5 w-5" />
              All Actions
            </CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-repgpt-800">
                <TabsTrigger value="cards" className="data-[state=active]:bg-repgpt-400">
                  Cards
                </TabsTrigger>
                <TabsTrigger value="table" className="data-[state=active]:bg-repgpt-400">
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription className="text-gray-400">
            {selectedOutlet 
              ? `Showing all actions for ${selectedOutlet}` 
              : "All actions in the system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="cards" className="mt-0">
              <div className="space-y-4 py-2">
                {isLoading ? (
                  <p className="text-center text-gray-400 py-10">Loading actions...</p>
                ) : actions.length === 0 ? (
                  <p className="text-center text-gray-400 py-10">No action items found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {actions.map((action) => (
                      <div 
                        key={action.id} 
                        className="flex items-start gap-2 p-3 bg-repgpt-800 rounded-md border border-repgpt-600"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-full p-1 ${action.completed ? 'bg-green-900/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}
                          onClick={() => toggleActionCompletion(action.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <p className={`text-sm ${action.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                            {action.text}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <Building className="h-3 w-3 mr-1" />
                              {action.outlet_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(action.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => deleteAction(action.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="table" className="mt-0">
              <ActionsTable 
                actions={actions}
                onToggleComplete={toggleActionCompletion}
                onDelete={deleteAction}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default NotesToActions;

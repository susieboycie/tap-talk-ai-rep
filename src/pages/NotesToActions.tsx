
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Edit, Check, Clipboard, ClipboardList, Building, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOutlet } from "@/contexts/outlet-context";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Action {
  id: string;
  text: string;
  completed: boolean;
  outlet_name?: string;
}

const NotesToActions = () => {
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const { user } = useAuth();
  const [notes, setNotes] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [outlets, setOutlets] = useState<string[]>([]);
  const [filterOutlet, setFilterOutlet] = useState<string>("all");

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

  // Fetch actions for the current outlet or all outlets
  useEffect(() => {
    const fetchActions = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('outlet_actions').select('*');
        
        if (filterOutlet !== 'all') {
          query = query.eq('outlet_name', filterOutlet);
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
            outlet_name: item.outlet_name
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
  }, [filterOutlet]);
  
  // Update filter outlet when selectedOutlet changes
  useEffect(() => {
    if (selectedOutlet) {
      setFilterOutlet(selectedOutlet);
    }
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
            outlet_name: data.outlet_name
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
      const { error } = await supabase
        .from('outlet_actions')
        .update({ completed: newCompletedState, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating action:", error);
        return;
      }
      
      setActions(
        actions.map(action =>
          action.id === id ? { ...action, completed: newCompletedState } : action
        )
      );
    } catch (error) {
      console.error("Error:", error);
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

      <h2 className="text-xl font-semibold text-white mb-4">Action Items</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </DashboardShell>
  );
};

export default NotesToActions;

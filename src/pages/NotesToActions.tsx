
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Separator } from "@/components/ui/separator";
import { Edit, Check, Clipboard, ClipboardList } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOutlet } from "@/contexts/outlet-context";
import { useAuth } from "@/contexts/auth-context";

interface Action {
  id: string;
  text: string;
  completed: boolean;
}

const NotesToActions = () => {
  const { outlet } = useOutlet();
  const { user } = useAuth();
  const [notes, setNotes] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Separate notes into actionable items
  const processNotes = () => {
    if (!notes.trim()) {
      toast({
        title: "Empty notes",
        description: "Please enter some notes to convert to actions.",
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
    
    const newActions = noteLines.map(text => ({
      id: crypto.randomUUID(),
      text,
      completed: false,
    }));
    
    setActions([...actions, ...newActions]);
    setNotes("");
    setIsProcessing(false);
    
    toast({
      title: "Notes processed",
      description: `${newActions.length} action items created.`,
    });
  };

  const toggleActionCompletion = (id: string) => {
    setActions(
      actions.map(action =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  const deleteAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id));
    toast({
      title: "Action removed",
      description: "The action item has been removed."
    });
  };

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Notes to Actions</h1>
        <p className="text-gray-400">
          Convert your outlet notes into actionable tasks for {outlet?.name || "your outlet"}
        </p>
      </div>

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
              disabled={isProcessing || !notes.trim()}
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
              Your actionable tasks appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {actions.length === 0 ? (
                <p className="text-center text-gray-400 py-10">No action items yet. Convert your notes to get started.</p>
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

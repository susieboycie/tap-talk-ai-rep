
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Plus, Calendar, Clock, FileText, User, Building, CheckCircle2 } from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";

// Mock tasks data
const initialTasks = [
  {
    id: "1",
    title: "Call Fox & Hound about new IPA promotion",
    description: "Discuss the upcoming summer IPA promotion and secure tap space",
    status: "pending",
    priority: "high",
    dueDate: "2023-04-24",
    customer: "The Fox & Hound",
    category: "Sales Call",
    completed: false
  },
  {
    id: "2",
    title: "Update trade terms for The Royal Oak",
    description: "Prepare new trade terms document with updated volume rebates",
    status: "pending",
    priority: "medium",
    dueDate: "2023-04-25",
    customer: "The Royal Oak",
    category: "Contract",
    completed: false
  },
  {
    id: "3",
    title: "Send volume forecast to regional manager",
    description: "Compile Q2 volume forecast for all accounts in the South region",
    status: "pending",
    priority: "high",
    dueDate: "2023-04-25",
    customer: "",
    category: "Reporting",
    completed: false
  },
  {
    id: "4",
    title: "Follow up with The Black Swan about tap rotation",
    description: "Check if they're ready to rotate the guest beer tap and suggest new options",
    status: "pending",
    priority: "medium",
    dueDate: "2023-04-26",
    customer: "The Black Swan",
    category: "Follow-up",
    completed: false
  },
  {
    id: "5",
    title: "Prepare quarterly business review presentation",
    description: "Create slides for the Q2 business review meeting with senior management",
    status: "pending",
    priority: "high",
    dueDate: "2023-04-28",
    customer: "",
    category: "Reporting",
    completed: false
  },
];

// Mock notes data
const initialNotes = [
  {
    id: "1",
    title: "Fox & Hound Meeting Notes",
    content: "Met with John from Fox & Hound today. They're interested in our new summer IPA but concerned about the price point. They currently have 3 taps available for rotation. Need to follow up with a competitive offer by next week.",
    date: "2023-04-21",
    customer: "The Fox & Hound",
    category: "Meeting Notes"
  },
  {
    id: "2",
    title: "The Royal Oak Volume Discussion",
    content: "Called Emma at Royal Oak to discuss current volume trends. They're down 12% vs last year. Main causes: reduced foot traffic and competition from nearby craft beer bar. Suggested tap takeover event in May and staff training session on our premium lager to boost sales.",
    date: "2023-04-19",
    customer: "The Royal Oak",
    category: "Call Notes"
  },
  {
    id: "3",
    title: "Q2 Strategy Review",
    content: "Internal strategy meeting for Q2. Focus areas: 1) Increase premium lager placement in high-traffic venues, 2) Push new IPA series in craft-focused locations, 3) Target at least 5 new accounts in the city center area.",
    date: "2023-04-18",
    customer: "",
    category: "Strategy"
  },
  {
    id: "4",
    title: "The Black Swan Tap Audit",
    content: "Conducted tap audit at Black Swan. They currently have: 2 premium lagers (1 ours, 1 competitor), 3 ales, 1 stout, 1 cider, and 1 rotating craft. Their craft rotation is changing next week - good opportunity to place our new session IPA.",
    date: "2023-04-15",
    customer: "The Black Swan",
    category: "Audit"
  },
];

export default function Tasks() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [notes, setNotes] = useState(initialNotes);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    customer: "",
    category: "Follow-up"
  });
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    customer: "",
    category: "Meeting Notes"
  });
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    const task = {
      id: (tasks.length + 1).toString(),
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      customer: newTask.customer,
      category: newTask.category,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      customer: "",
      category: "Follow-up"
    });
    setIsTaskDialogOpen(false);
    
    toast({
      title: "Task Added",
      description: "Your new task has been added successfully",
    });
  };

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Error",
        description: "Note title and content are required",
        variant: "destructive",
      });
      return;
    }

    const note = {
      id: (notes.length + 1).toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString().split('T')[0],
      customer: newNote.customer,
      category: newNote.category
    };

    setNotes([...notes, note]);
    setNewNote({
      title: "",
      content: "",
      customer: "",
      category: "Meeting Notes"
    });
    setIsNoteDialogOpen(false);
    
    toast({
      title: "Note Added",
      description: "Your new note has been added successfully",
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Notes & Tasks</h1>
          <p className="text-gray-400">
            Manage your follow-ups, meeting notes, and to-do items
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

      <Tabs defaultValue="tasks" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-repgpt-700">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-repgpt-400">Tasks</TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-repgpt-400">Notes</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-repgpt-400 hover:bg-repgpt-500 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-repgpt-800 border-repgpt-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Task</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new task to track your follow-ups and to-dos.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="task-title" className="text-white">Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Enter task title"
                      className="bg-repgpt-700 border-repgpt-600 text-white"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-description" className="text-white">Description</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Enter task description"
                      className="bg-repgpt-700 border-repgpt-600 text-white resize-none h-20"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-priority" className="text-white">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger id="task-priority" className="bg-repgpt-700 border-repgpt-600 text-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-repgpt-700 border-repgpt-600 text-white">
                          <SelectItem value="low" className="focus:bg-repgpt-600 focus:text-white">Low</SelectItem>
                          <SelectItem value="medium" className="focus:bg-repgpt-600 focus:text-white">Medium</SelectItem>
                          <SelectItem value="high" className="focus:bg-repgpt-600 focus:text-white">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-due-date" className="text-white">Due Date</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        className="bg-repgpt-700 border-repgpt-600 text-white"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-customer" className="text-white">Customer (Optional)</Label>
                      <Input
                        id="task-customer"
                        placeholder="Customer name"
                        className="bg-repgpt-700 border-repgpt-600 text-white"
                        value={newTask.customer}
                        onChange={(e) => setNewTask({ ...newTask, customer: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-category" className="text-white">Category</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger id="task-category" className="bg-repgpt-700 border-repgpt-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-repgpt-700 border-repgpt-600 text-white">
                          <SelectItem value="Follow-up" className="focus:bg-repgpt-600 focus:text-white">Follow-up</SelectItem>
                          <SelectItem value="Sales Call" className="focus:bg-repgpt-600 focus:text-white">Sales Call</SelectItem>
                          <SelectItem value="Meeting" className="focus:bg-repgpt-600 focus:text-white">Meeting</SelectItem>
                          <SelectItem value="Contract" className="focus:bg-repgpt-600 focus:text-white">Contract</SelectItem>
                          <SelectItem value="Reporting" className="focus:bg-repgpt-600 focus:text-white">Reporting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-repgpt-600 text-white hover:bg-repgpt-700" onClick={() => setIsTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-repgpt-400 hover:bg-repgpt-500 text-white" onClick={handleAddTask}>
                    Add Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-repgpt-400 hover:bg-repgpt-500 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-repgpt-800 border-repgpt-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Note</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new note to capture important information.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="note-title" className="text-white">Title</Label>
                    <Input
                      id="note-title"
                      placeholder="Enter note title"
                      className="bg-repgpt-700 border-repgpt-600 text-white"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-content" className="text-white">Content</Label>
                    <Textarea
                      id="note-content"
                      placeholder="Enter note content"
                      className="bg-repgpt-700 border-repgpt-600 text-white resize-none h-32"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-customer" className="text-white">Customer (Optional)</Label>
                      <Input
                        id="note-customer"
                        placeholder="Customer name"
                        className="bg-repgpt-700 border-repgpt-600 text-white"
                        value={newNote.customer}
                        onChange={(e) => setNewNote({ ...newNote, customer: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note-category" className="text-white">Category</Label>
                      <Select
                        value={newNote.category}
                        onValueChange={(value) => setNewNote({ ...newNote, category: value })}
                      >
                        <SelectTrigger id="note-category" className="bg-repgpt-700 border-repgpt-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-repgpt-700 border-repgpt-600 text-white">
                          <SelectItem value="Meeting Notes" className="focus:bg-repgpt-600 focus:text-white">Meeting Notes</SelectItem>
                          <SelectItem value="Call Notes" className="focus:bg-repgpt-600 focus:text-white">Call Notes</SelectItem>
                          <SelectItem value="Strategy" className="focus:bg-repgpt-600 focus:text-white">Strategy</SelectItem>
                          <SelectItem value="Audit" className="focus:bg-repgpt-600 focus:text-white">Audit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-repgpt-600 text-white hover:bg-repgpt-700" onClick={() => setIsNoteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-repgpt-400 hover:bg-repgpt-500 text-white" onClick={handleAddNote}>
                    Add Note
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <TabsContent value="tasks">
          <div className="space-y-4">
            <Card className="border-repgpt-700 bg-repgpt-800">
              <CardHeader>
                <CardTitle className="text-white">Pending Tasks</CardTitle>
                <CardDescription className="text-gray-400">
                  Tasks that require your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No pending tasks.</p>
                  ) : (
                    pendingTasks.map(task => (
                      <div key={task.id} className="flex items-start gap-3 p-3 border border-repgpt-700 rounded-md hover:bg-repgpt-700">
                        <Checkbox 
                          id={`task-${task.id}`} 
                          className="mt-1 border-repgpt-400" 
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor={`task-${task.id}`}
                              className="font-medium text-white cursor-pointer hover:text-repgpt-400"
                            >
                              {task.title}
                            </label>
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                task.priority === "high" 
                                  ? "bg-red-500/20 text-red-300" 
                                  : task.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                              }`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <div className="flex items-center gap-4">
                              {task.dueDate && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              )}
                              {task.customer && (
                                <div className="flex items-center">
                                  <Building className="h-3 w-3 mr-1" />
                                  {task.customer}
                                </div>
                              )}
                            </div>
                            <span className="bg-repgpt-700 px-2 py-0.5 rounded text-gray-400">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-repgpt-700 bg-repgpt-800">
              <CardHeader>
                <CardTitle className="text-white">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No completed tasks.</p>
                  ) : (
                    completedTasks.map(task => (
                      <div key={task.id} className="flex items-start gap-3 p-3 border border-repgpt-700 rounded-md hover:bg-repgpt-700 opacity-60">
                        <Checkbox 
                          id={`task-${task.id}`} 
                          className="mt-1 border-repgpt-400" 
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor={`task-${task.id}`}
                              className="font-medium text-white cursor-pointer hover:text-repgpt-400 line-through"
                            >
                              {task.title}
                            </label>
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <div className="flex items-center gap-4">
                              {task.customer && (
                                <div className="flex items-center">
                                  <Building className="h-3 w-3 mr-1" />
                                  {task.customer}
                                </div>
                              )}
                            </div>
                            <span className="bg-repgpt-700 px-2 py-0.5 rounded text-gray-400">
                              Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-center py-6 col-span-2">No notes found.</p>
            ) : (
              notes.map(note => (
                <Card key={note.id} className="border-repgpt-700 bg-repgpt-800 hover:border-repgpt-600">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{note.title}</CardTitle>
                      <span className="bg-repgpt-700 px-2 py-1 rounded text-xs text-gray-400">
                        {note.category}
                      </span>
                    </div>
                    <CardDescription className="flex items-center text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {note.date}
                      {note.customer && (
                        <>
                          <span className="mx-1">•</span>
                          <User className="h-3 w-3 mr-1" />
                          {note.customer}
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 whitespace-pre-line">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </DashboardShell>
  );
}

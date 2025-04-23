
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
  { id: 1, title: "Call Fox & Hound about new IPA promotion", date: "Today", priority: "High" },
  { id: 2, title: "Update trade terms for The Royal Oak", date: "Tomorrow", priority: "Medium" },
  { id: 3, title: "Send volume forecast to regional manager", date: "Apr 25", priority: "High" },
  { id: 4, title: "Follow up with The Black Swan about tap rotation", date: "Apr 26", priority: "Medium" },
  { id: 5, title: "Prepare quarterly business review presentation", date: "Apr 28", priority: "High" },
];

export function UpcomingTasks() {
  return (
    <Card className="col-span-2 border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-white">Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-start gap-3 border-b border-repgpt-700 pb-3 last:border-0">
              <Checkbox id={`task-${task.id}`} className="mt-1 border-repgpt-400" />
              <div className="flex-1">
                <label 
                  htmlFor={`task-${task.id}`}
                  className="text-sm font-medium text-white cursor-pointer hover:text-repgpt-400"
                >
                  {task.title}
                </label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{task.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === "High" 
                      ? "bg-red-500/20 text-red-300" 
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

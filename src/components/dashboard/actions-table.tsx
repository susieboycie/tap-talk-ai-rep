
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Action {
  id: string;
  text: string;
  completed: boolean;
  outlet_name?: string;
  created_at: string;
  updated_at: string;
}

interface ActionsTableProps {
  actions: Action[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ActionsTable({ actions, onToggleComplete, onDelete }: ActionsTableProps) {
  // Sort actions by creation date (newest first)
  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="rounded-md border border-repgpt-600 overflow-hidden">
      <Table>
        <TableCaption>All outlet actions</TableCaption>
        <TableHeader>
          <TableRow className="bg-repgpt-700 hover:bg-repgpt-700">
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Action Item</TableHead>
            <TableHead className="text-white">Outlet</TableHead>
            <TableHead className="text-white">Created</TableHead>
            <TableHead className="text-white">Last Updated</TableHead>
            <TableHead className="text-white w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                No actions found
              </TableCell>
            </TableRow>
          ) : (
            sortedActions.map((action) => (
              <TableRow key={action.id} className="bg-repgpt-800 hover:bg-repgpt-700">
                <TableCell className="font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full p-1 ${action.completed ? 'bg-green-900/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}
                    onClick={() => onToggleComplete(action.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className={`font-medium ${action.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {action.text}
                </TableCell>
                <TableCell className="text-gray-400">{action.outlet_name}</TableCell>
                <TableCell className="text-gray-400">
                  {new Date(action.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-400">
                  {new Date(action.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => onDelete(action.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

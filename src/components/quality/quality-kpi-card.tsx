
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityKPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  status: "red" | "amber" | "green";
}

export function QualityKPICard({ title, value, icon: Icon, status }: QualityKPICardProps) {
  const getStatusColor = (status: "red" | "amber" | "green") => {
    switch (status) {
      case "red":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "amber":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "green":
        return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  return (
    <Card className={`border ${getStatusColor(status)}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

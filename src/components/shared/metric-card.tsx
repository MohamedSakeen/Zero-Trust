import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-gray-400",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("bg-white border border-gray-200 shadow-md text-gray-900", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-gray-900">
        <CardTitle className="text-sm font-medium text-gray-900">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  );
}

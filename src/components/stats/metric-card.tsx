import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  color?: "accent" | "success" | "warning" | "error";
}

export function MetricCard({ icon: Icon, value, label, color = "accent" }: MetricCardProps) {
  const iconColors = {
    accent: "bg-accent-subtle text-accent",
    success: "bg-success-subtle text-success",
    warning: "bg-warning-subtle text-warning",
    error: "bg-error-subtle text-error",
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <span className="text-sm font-medium text-secondary">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

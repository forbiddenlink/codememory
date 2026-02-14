import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  color: "orange" | "purple" | "blue" | "green";
}

const colorClasses = {
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    border: "border-orange-200",
    icon: "bg-orange-500",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    border: "border-purple-200",
    icon: "bg-purple-500",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    border: "border-blue-200",
    icon: "bg-blue-500",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    border: "border-green-200",
    icon: "bg-green-500",
  },
};

export function MetricCard({ icon: Icon, value, label, color }: MetricCardProps) {
  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-xl shadow-md p-6 border ${classes.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${classes.icon} rounded-lg flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
    </div>
  );
}

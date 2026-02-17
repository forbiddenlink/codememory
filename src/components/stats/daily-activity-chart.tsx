import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyReviews {
  date: string;
  count: number;
  displayDate: string;
}

interface DailyActivityChartProps {
  data: DailyReviews[];
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-5 mb-6">
      <h2 className="text-base font-semibold text-foreground mb-4">Review Activity (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11 }}
            stroke="var(--text-tertiary)"
          />
          <YAxis stroke="var(--text-tertiary)" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

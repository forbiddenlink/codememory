import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PieChartItem {
  name: string;
  count: number;
  color: string;
  [key: string]: string | number | undefined;
}

interface PieChartCardProps {
  title: string;
  data: PieChartItem[];
  emptyMessage: string;
  labelFormatter: (item: PieChartItem) => string;
}

export function PieChartCard({ title, data, emptyMessage, labelFormatter }: PieChartCardProps) {
  const hasData = data.length > 0 && data.some((item) => item.count > 0);

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">{title}</h2>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => {
                  const item = props as unknown as PieChartItem;
                  return item.count > 0 ? labelFormatter(item) : "";
                }}
                outerRadius={70}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-secondary">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-secondary text-sm py-10">{emptyMessage}</div>
      )}
    </div>
  );
}

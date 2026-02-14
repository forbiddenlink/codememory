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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
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
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-12">{emptyMessage}</div>
      )}
    </div>
  );
}

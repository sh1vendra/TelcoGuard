import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  available: '#10b981',
  assigned: '#3b82f6',
  porting: '#f59e0b',
  suspended: '#6b7280',
  flagged: '#ef4444',
};

export default function StatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d._id || 'unknown',
    value: d.count,
    color: STATUS_COLORS[d._id] || '#9ca3af',
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Numbers by Status</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(val, name) => [val, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

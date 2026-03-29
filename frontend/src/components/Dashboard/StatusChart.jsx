import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  available: '#34D399',
  assigned: '#0A84FF',
  porting: '#FBBF24',
  suspended: '#52525B',
  flagged: '#F87171',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-xs">
        <p className="text-[#A1A1AA] capitalize">{payload[0].name}</p>
        <p className="text-[#E4E4E7] font-semibold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function StatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-5 flex items-center justify-center h-64">
        <p className="text-[#71717A] text-sm">No data available</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d._id || 'unknown',
    value: d.count,
    color: STATUS_COLORS[d._id] || '#9ca3af',
  }));

  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-xl p-5">
      <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide mb-4">Numbers by Status</h3>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#71717A' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

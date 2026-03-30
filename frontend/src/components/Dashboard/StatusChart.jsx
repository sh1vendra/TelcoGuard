import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  available: '#059669',
  assigned: '#2563EB',
  porting: '#D97706',
  suspended: '#9CA3AF',
  flagged: '#DC2626',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="text-gray-500 dark:text-[#A1A1AA] capitalize mb-0.5">{payload[0].name}</p>
        <p className="text-gray-900 dark:text-[#F4F4F5] font-semibold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-gray-500 dark:text-[#A1A1AA] capitalize">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function StatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-5 flex items-center justify-center h-72">
        <p className="text-gray-400 dark:text-[#71717A] text-sm">No data available</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d._id || 'unknown',
    value: d.count,
    color: STATUS_COLORS[d._id] || '#E5E7EB',
  }));

  return (
    <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-5">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider mb-4">
        Numbers by Status
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PortingFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
        <option value="flagged">Flagged</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#A1A1AA] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.flaggedOnly}
          onChange={(e) => onChange({ ...filters, flaggedOnly: e.target.checked })}
          className="rounded accent-blue-600"
        />
        Flagged only
      </label>
    </div>
  );
}

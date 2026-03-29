export default function PortingFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
        <option value="flagged">Flagged</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-[#A1A1AA] cursor-pointer">
        <input
          type="checkbox"
          checked={filters.flaggedOnly}
          onChange={(e) => onChange({ ...filters, flaggedOnly: e.target.checked })}
          className="rounded accent-[#0A84FF]"
        />
        Flagged only
      </label>
    </div>
  );
}

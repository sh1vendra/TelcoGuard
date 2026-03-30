export default function PhoneFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
      >
        <option value="">All Statuses</option>
        <option value="available">Available</option>
        <option value="assigned">Assigned</option>
        <option value="porting">Porting</option>
        <option value="suspended">Suspended</option>
        <option value="flagged">Flagged</option>
      </select>
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
      >
        <option value="">All Types</option>
        <option value="local">Local</option>
        <option value="toll-free">Toll-Free</option>
        <option value="mobile">Mobile</option>
        <option value="voip">VoIP</option>
      </select>
      <input
        type="text"
        placeholder="Search number, carrier, customer..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors w-64"
      />
    </div>
  );
}

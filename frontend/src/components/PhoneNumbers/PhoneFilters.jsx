export default function PhoneFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors"
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
        className="bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors"
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
        className="bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors w-64 placeholder:text-[#71717A]"
      />
    </div>
  );
}

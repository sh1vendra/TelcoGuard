export default function PhoneFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />
    </div>
  );
}

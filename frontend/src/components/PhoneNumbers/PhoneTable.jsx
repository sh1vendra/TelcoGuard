const STATUS_BADGE = {
  available: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  assigned: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  porting: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  suspended: 'bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#71717A]',
  flagged: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
};

export default function PhoneTable({ phones, onRowClick }) {
  if (!phones || phones.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-12 text-center text-gray-400 dark:text-[#71717A] text-sm">
        No phone numbers found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Number</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Type</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Status</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Carrier</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Assigned To</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Area Code</th>
          </tr>
        </thead>
        <tbody>
          {phones.map((phone) => (
            <tr
              key={phone._id}
              onClick={() => onRowClick && onRowClick(phone)}
              className="border-b border-gray-100 dark:border-[#27272A]/40 last:border-0 hover:bg-gray-50/80 dark:hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
            >
              <td className="px-4 py-3.5 font-mono text-sm text-gray-900 dark:text-[#F4F4F5]">{phone.number}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA] capitalize">{phone.type}</td>
              <td className="px-4 py-3.5">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${STATUS_BADGE[phone.status] || 'bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#71717A]'}`}>
                  {phone.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA]">{phone.carrier || '—'}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA]">{phone.assignedTo || '—'}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA]">{phone.areaCode || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

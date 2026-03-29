const STATUS_BADGE = {
  available: 'bg-emerald-400/10 text-emerald-400',
  assigned: 'bg-[#0A84FF]/10 text-[#0A84FF]',
  porting: 'bg-amber-400/10 text-amber-400',
  suspended: 'bg-zinc-500/20 text-zinc-400',
  flagged: 'bg-red-400/10 text-red-400',
};

export default function PhoneTable({ phones, onRowClick }) {
  if (!phones || phones.length === 0) {
    return (
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-12 text-center text-[#71717A]">
        No phone numbers found.
      </div>
    );
  }

  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-[#27272A]">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Number</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Carrier</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Assigned To</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Area Code</th>
          </tr>
        </thead>
        <tbody>
          {phones.map((phone) => (
            <tr
              key={phone._id}
              onClick={() => onRowClick && onRowClick(phone)}
              className="border-b border-[#27272A]/50 last:border-0 hover:bg-[#17171A] cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-mono text-sm text-[#E4E4E7]">{phone.number}</td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA] capitalize">{phone.type}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[phone.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                  {phone.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA]">{phone.carrier || '—'}</td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA]">{phone.assignedTo || '—'}</td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA]">{phone.areaCode || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

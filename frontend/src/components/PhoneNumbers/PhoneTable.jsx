const STATUS_BADGE = {
  available: 'bg-green-100 text-green-700',
  assigned: 'bg-blue-100 text-blue-700',
  porting: 'bg-orange-100 text-orange-700',
  suspended: 'bg-gray-100 text-gray-600',
  flagged: 'bg-red-100 text-red-700',
};

export default function PhoneTable({ phones, onRowClick }) {
  if (!phones || phones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
        No phone numbers found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Number</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Carrier</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Area Code</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {phones.map((phone) => (
            <tr
              key={phone._id}
              onClick={() => onRowClick && onRowClick(phone)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-mono text-gray-800">{phone.number}</td>
              <td className="px-4 py-3 capitalize text-gray-600">{phone.type}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[phone.status] || 'bg-gray-100 text-gray-600'}`}>
                  {phone.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{phone.carrier || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{phone.assignedTo || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{phone.areaCode || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

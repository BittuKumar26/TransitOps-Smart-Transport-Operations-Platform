export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-100">
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 text-slate-700">
                  {row[column] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

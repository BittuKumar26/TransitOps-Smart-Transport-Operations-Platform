export const exportToCSV = (rows = []) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];

  for (const row of rows) {
    csvRows.push(headers.map((header) => JSON.stringify(row[header] ?? '')).join(','));
  }

  return csvRows.join('\n');
};

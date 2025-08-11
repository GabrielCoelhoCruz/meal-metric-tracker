// Simple CSV export utility with UTF-8 BOM for Excel compatibility
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitized = filename
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_\.]/g, '')
    .toLowerCase();

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.map((v) => formatCsvCell(v)).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = sanitized.endsWith('.csv') ? sanitized : `${sanitized}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatCsvCell(v: string | number) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // Escape quotes and wrap in quotes if needed
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

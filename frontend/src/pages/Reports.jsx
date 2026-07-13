import { useEffect, useState } from 'react';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import { downloadReportCsv, getReports } from '../api/dashboardApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await getReports();
        setReport(response.data.data ?? response.data);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const handleDownload = async () => {
    try {
      setError('');
      setDownloading(true);
      const response = await downloadReportCsv();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `transitops-report-${Date.now()}.csv`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to download report CSV');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Analytics & reporting</p>
        <h2 className="mt-2 text-3xl font-semibold">Reports</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Trip Status Distribution</h3>
            <div className="space-y-3">
              {(report?.tripStatus || []).map((row) => (
                <div key={row.status} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                  <span className="font-medium text-slate-700">{row.status}</span>
                  <span className="text-slate-500">{row.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Fuel Summary</h3>
            <p className="text-sm text-slate-500">Total liters: {report?.fuel?.totalLiters || 0}</p>
            <p className="mt-2 text-sm text-slate-500">Total cost: {formatCurrency(report?.fuel?.totalCost || 0)}</p>

            <h3 className="mb-4 mt-6 text-lg font-semibold text-ink">Top Expense Types</h3>
            <div className="space-y-2 text-sm text-slate-600">
              {(report?.expensesByType || []).slice(0, 5).map((row) => (
                <p key={row.type}>{row.type}: {formatCurrency(row.amount)}</p>
              ))}
            </div>

            <Button type="button" className="mt-6 w-full bg-teal-600" disabled={downloading} onClick={handleDownload}>
              {downloading ? 'Preparing CSV...' : 'Download CSV Report'}
            </Button>
          </Card>
        </section>
      )}
    </div>
  );
}

import client from './axios.js';

export const getDashboardSummary = () => client.get('/dashboard');
export const getReports = () => client.get('/reports');
export const downloadReportCsv = () => client.get('/reports/csv', { responseType: 'blob' });

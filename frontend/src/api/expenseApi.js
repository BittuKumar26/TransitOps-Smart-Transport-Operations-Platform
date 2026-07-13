import client from './axios.js';

export const getExpenses = (params = {}) => client.get('/expenses', { params });
export const createExpense = (payload) => client.post('/expenses', payload);
export const deleteExpense = (id) => client.delete(`/expenses/${id}`);

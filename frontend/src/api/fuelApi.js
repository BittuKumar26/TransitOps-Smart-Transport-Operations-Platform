import client from './axios.js';

export const getFuelLogs = (params = {}) => client.get('/fuel', { params });
export const createFuelLog = (payload) => client.post('/fuel', payload);
export const deleteFuelLog = (id) => client.delete(`/fuel/${id}`);

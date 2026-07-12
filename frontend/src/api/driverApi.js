import client from './axios.js';

export const getDrivers = (params = {}) => client.get('/drivers', { params });
export const createDriver = (payload) => client.post('/drivers', payload);
export const getDriverById = (id) => client.get(`/drivers/${id}`);
export const updateDriver = (id, payload) => client.put(`/drivers/${id}`, payload);
export const deleteDriver = (id) => client.delete(`/drivers/${id}`);

import client from './axios.js';

export const getVehicles = (params = {}) => client.get('/vehicles', { params });
export const createVehicle = (payload) => client.post('/vehicles', payload);
export const updateVehicle = (id, payload) => client.put(`/vehicles/${id}`, payload);
export const deleteVehicle = (id) => client.delete(`/vehicles/${id}`);

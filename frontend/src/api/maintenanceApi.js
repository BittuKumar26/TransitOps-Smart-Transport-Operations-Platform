import client from './axios.js';

export const getMaintenance = (params = {}) => client.get('/maintenance', { params });
export const createMaintenance = (payload) => client.post('/maintenance', payload);
export const closeMaintenance = (id) => client.patch(`/maintenance/${id}/close`);
export const deleteMaintenance = (id) => client.delete(`/maintenance/${id}`);

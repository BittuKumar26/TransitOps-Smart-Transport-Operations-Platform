import client from './axios.js';

export const getTrips = (params = {}) => client.get('/trips', { params });
export const createTrip = (payload) => client.post('/trips', payload);
export const getTripById = (id) => client.get(`/trips/${id}`);
export const updateTrip = (id, payload) => client.put(`/trips/${id}`, payload);
export const deleteTrip = (id) => client.delete(`/trips/${id}`);
export const dispatchTrip = (id) => client.patch(`/trips/${id}/dispatch`);
export const completeTrip = (id) => client.patch(`/trips/${id}/complete`);
export const cancelTrip = (id) => client.patch(`/trips/${id}/cancel`);

import client from './axios.js';

export const login = (payload) => client.post('/auth/login', payload);
export const register = (payload) => client.post('/auth/register', payload);
export const getMe = () => client.get('/auth/me');

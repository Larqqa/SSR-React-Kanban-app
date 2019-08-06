import axios from 'axios';
const baseUrl = '/api/user';

const login = async (user) => {
  const res = await axios.post('/api/login', user);
  return res.data;
};

const logout = async (token) => {
  const res = await axios.post('/api/login/logout', { token: token });
  return res.data;
};

const auth = async (token) => {
  const res = await axios.post('/api/login/auth', { token: token });
  return res.data;
};

const register = async (user) => {
  const res = await axios.post(baseUrl, user);
  return res.data;
};

export default { login, logout, auth, register };
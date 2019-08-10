import axios from 'axios';
const baseUrl = '/api/user';

const login = async (user) => {
  const res = await axios.post('/api/login', user);
  return res.data;
};

const register = async (user) => {
  const res = await axios.post(baseUrl, user);
  return res.data;
};

const auth = async (token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };

  const res = await axios.get('/api/login/auth', config);
  return res.data;
};

const getUserID = async (username) => {
  const res = await axios.get(`${baseUrl}/${username}`);
  return res.data;
};

export default { login, register, auth, getUserID };
import axios from 'axios';
const baseUrl = '/api/projects';

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.get(baseUrl, config);
  return request.then(response => response.data);
};

const create = async (project) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, project, config);
  return res.data;
};

export default { getAll, create, setToken };
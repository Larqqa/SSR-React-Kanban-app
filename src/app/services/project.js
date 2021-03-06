import axios from 'axios';
const baseUrl = '/api/projects';

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const createProject = async (project) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, project, config);
  return res.data;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.get(baseUrl, config);
  return request.then(response => response.data);
};

const editTask = async (proj) => {
  const config = {
    headers: { Authorization: token },
  };

  const project = proj;
  project.read = project.read.map(user => user.id ? user.id : user);
  project.readAndWrite = project.readAndWrite.map(user => user.id ? user.id : user);

  const res = await axios.put(baseUrl, project, config);
  return res.data;
};

const deleteProject = async (project) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.delete(`${baseUrl}/${project.id}`, config);
  return res.data;
};

export default { setToken, createProject, getAll, editTask, deleteProject };
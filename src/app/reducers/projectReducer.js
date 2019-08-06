import projectService from '../services/project';

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_PROJECTS':
    return action.data;
  case 'ADD_PROJECT':
    return [...state, action.data];
  default:
    return state;
  }
};

export const getProjects = () => {
  return async dispatch => {
    try {
      const projects = await projectService.getAll();
      dispatch({
        type: 'INIT_PROJECTS',
        data: projects,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const addProject = (project) => {
  return async dispatch => {
    try {
      const newProject = await projectService.create(project);
      dispatch({
        type: 'ADD_PROJECT',
        data: newProject,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export default reducer;
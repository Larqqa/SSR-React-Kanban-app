import projectService from '../services/project';

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_PROJECTS':
    return action.data;
  case 'ADD_PROJECT':
    return [...state, action.data];
  case 'CHANGE_TASK':
    return state.map(
      project => project.id === action.data.id ?
        action.data
        :
        project
    );
  case 'DELETE_PROJECT':
    return state.filter(
      project =>
        project.id !== action.data
    );
  case 'CLEAR_PROJECTS':
    return [];
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
      const newProject = await projectService.createProject(project);
      dispatch({
        type: 'ADD_PROJECT',
        data: newProject,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const addTask = (project) => {
  return async dispatch => {
    try {
      const editedProject = await projectService.editTask(project);
      dispatch({
        type: 'CHANGE_TASK',
        data: editedProject,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const removeTask = (project) => {
  return async dispatch => {
    try {
      const editedProject = await projectService.editTask(project);
      dispatch({
        type: 'CHANGE_TASK',
        data: editedProject,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const editProjectUsers = (project) => {
  return async dispatch => {
    try {
      const editedProject = await projectService.editTask(project);
      dispatch({
        type: 'CHANGE_TASK',
        data: editedProject,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const deleteProject = (project) => {
  return dispatch => {
    try {
      projectService.deleteProject(project);
      dispatch({
        type: 'DELETE_PROJECT',
        data: project.id,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const clearProjects = () => {
  return {
    type: 'CLEAR_PROJECTS',
  };
};

export default reducer;
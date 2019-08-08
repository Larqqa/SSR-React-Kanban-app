import userService from '../services/user';
import projectService from '../services/project';
import { getProjects, clearProjects } from './projectReducer';

const userReducer = (state = {}, action) => {
  switch (action.type) {
  case 'INIT':
    return action.data;
  case 'LOGIN':
    return action.data;
  case 'LOGOUT':
    return {};
  case 'REGISTER':
    return action.data;
  default:
    return state;
  }
};

const addToLocal = (user) => {
  projectService.setToken(user.token);
  window.localStorage.setItem(
    'USER', JSON.stringify(user)
  );
};

export const initUser = (userInput) => {
  return async dispatch => {
    try{
      await userService.auth(userInput.token);
      projectService.setToken(userInput.token);
      dispatch({
        type: 'INIT',
        data: userInput,
      });
    } catch (er) {
      console.log(er);
      window.localStorage.clear();
    }
  };
};

export const login = (userInput) => {
  return async dispatch => {
    try {
      const user = await userService.login(userInput);
      await addToLocal(user);
      dispatch(getProjects());
      dispatch({
        type: 'LOGIN',
        data: user,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const logout = () => {
  return async dispatch => {
    window.localStorage.clear();
    dispatch(clearProjects());
    dispatch({
      type: 'LOGOUT',
    });
  };
};

export const register = (userInput) => {
  return async dispatch => {
    try{
      const user = await userService.register(userInput);
      addToLocal(user);
      dispatch({
        type: 'REGISTER',
        data: user,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export default userReducer;
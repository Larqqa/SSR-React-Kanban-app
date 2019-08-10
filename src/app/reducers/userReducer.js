import userService from '../services/user';
import projectService from '../services/project';
import { getProjects, clearProjects } from './projectReducer';

const userReducer = (state = {}, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data;
  case 'LOGOUT':
    return {};
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
      await projectService.setToken(userInput.token);

      dispatch({
        type: 'SET_USER',
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
        type: 'SET_USER',
        data: user,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export const logout = () => {
  return dispatch => {
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
      await addToLocal(user);

      dispatch({
        type: 'SET_USER',
        data: user,
      });
    } catch (er) {
      console.log(er);
    }
  };
};

export default userReducer;
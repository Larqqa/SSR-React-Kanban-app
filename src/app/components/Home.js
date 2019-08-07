import React from 'react';
import { connect } from 'react-redux';
import { addProject } from '../reducers/projectReducer';
import { logout } from '../reducers/userReducer';
import Login from './Login';
import Register from './Register';
import Projects from './sub-components/Projects';

const Home = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      title: e.target.title.value,
      description: e.target.description.value
    };

    props.addProject(obj);
  };

  const handleLogout = () => {
    props.logout();
  };

  return (
    <div>
      {props.user.username ?
        <>
          <h1>{props.user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
          <form onSubmit={handleSubmit}>
            <input name="title" />
            <input name="description" />
            <button>send</button>
          </form>
          <Projects />
        </>
        :
        <>
          <Login />
          <Register />
        </>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { addProject, logout }
)(Home);
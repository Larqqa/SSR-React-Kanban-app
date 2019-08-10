import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { initUser } from './reducers/userReducer';
import { getProjects } from './reducers/projectReducer';
import routes, { NavLinks } from './Routes';
import './styles/App.scss';

const App = ( props ) => {
  const init =  async () => {
    const loggedIn = window.localStorage.getItem( 'USER' );

    if ( loggedIn ) {
      const user = JSON.parse( loggedIn );
      await props.initUser( user );
      props.getProjects();
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <header>
        <NavLinks />
      </header>
      <Switch>{ renderRoutes( routes ) }</Switch>
    </>
  );
};

const mapStateToProps = ( state ) => {
  return {
    user: state.user,
    projects: state.projects
  };
};

export default connect(
  mapStateToProps,
  {
    initUser,
    getProjects
  }
)( App );
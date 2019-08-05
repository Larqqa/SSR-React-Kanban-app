import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { initializeGet } from './reducers/get';

import { Switch, Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './Routes';

const App = (props) => {
  useEffect(() => {
    props.initializeGet();
  },[props]);

  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>

      <Switch>
        {renderRoutes(routes)}
      </Switch>
    </div>
  );
};

export default connect(null, { initializeGet })(App);
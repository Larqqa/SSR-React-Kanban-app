import React from 'react';
import { Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/sub-components/Projects';
import Project from './components/Project';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/about',
    exact: true,
    component: About,
  },
  {
    path: '/about/:id',
    exact: true,
    component: About,
  },
  {
    path: '/projects',
    exact: true,
    component: Projects,
  },
  {
    path: '/projects/:id',
    exact: true,
    component: Project,
  },
];

export const NavLinks = () => {
  return (
    <div id="nav-bar">
      <Link className="nav-item" to="/">Home</Link>
      <Link className="nav-item" to="/about">About</Link>
    </div>
  );
};

export default routes;
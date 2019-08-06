import React from 'react';
import { Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';

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
    data: 'Moi'
  },
  {
    path: '/about/:id',
    exact: true,
    component: About,
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
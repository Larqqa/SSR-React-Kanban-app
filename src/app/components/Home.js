import React from 'react';
import { connect } from 'react-redux';
import getService from '../services/get';
import { addGet } from '../reducers/get';

const Home = (props) => {
  const handleClick = () => {
    props.addGet(1);
  };

  const handleGet = async () => {
    const data = await getService.getAll();
    console.log(data);
  };

  return (
    <div>
      <h1>Hello im home moi</h1>
      <p>clicks on this shizz: {props.clicks} </p>
      <button onClick={handleClick}>click</button>
      <button onClick={handleGet}>get</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    clicks: state,
  };
};

const mapDispatchToProps = { addGet };

const h = connect(mapStateToProps, mapDispatchToProps)(Home);
export default h;
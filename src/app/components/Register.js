import React, { useState } from 'react';
import { connect } from 'react-redux';
import { register } from '../reducers/userReducer';

const Register = (props) => {
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'username') {
      setUserName(e.target.value);
    } else if (e.target.name === 'password') {
      setPass(e.target.value);
    } else {
      setName(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      username: e.target.username.value,
      name: e.target.name.value,
      password: e.target.password.value
    };

    props.register(obj);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={userName} placeholder="username" type="text" name="username" onChange={handleChange} />
        <input value={name} placeholder="name" type="text" name="name" onChange={handleChange} />
        <input value={pass} placeholder="password" type="password" name="password" onChange={handleChange} />
        <button>Reqister</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { register }
)(Register);
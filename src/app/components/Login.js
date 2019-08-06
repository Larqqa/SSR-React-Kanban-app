import React, { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../reducers/userReducer';

const Login = (props) => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'username') {
      setName(e.target.value);
    } else {
      setPass(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      username: e.target.username.value,
      password: e.target.password.value
    };

    props.login(obj);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={name} placeholder="username" type="text" name="username" onChange={handleChange} />
        <input value={pass} placeholder="password" type="password" name="password" onChange={handleChange} />
        <button>Login</button>
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
  { login }
)(Login);
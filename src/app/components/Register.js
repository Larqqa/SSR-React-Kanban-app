import React, { useState } from 'react';
import { connect } from 'react-redux';
import { register } from '../reducers/userReducer';

const Register = ( props ) => {
  const [ userName, setUserName ] = useState('');
  const [ name, setName ] = useState('');
  const [ pass, setPass ] = useState('');

  const handleInputChange = (e) => {
    if (e.target.name === 'username') {
      setUserName(e.target.value);
    } else if (e.target.name === 'password') {
      setPass(e.target.value);
    } else {
      setName(e.target.value);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const obj = {
      username: e.target.username.value,
      name: e.target.name.value,
      password: e.target.password.value
    };

    props.register(obj);

    setPass('');
  };

  return (
    <div className="block">
      <h3>Register</h3>
      <form className="register" onSubmit={handleRegister}>
        <input value={userName} placeholder="username" type="text" name="username" onChange={handleInputChange} />
        <input value={name} placeholder="name" type="text" name="name" onChange={handleInputChange} />
        <input value={pass} placeholder="password" type="password" name="password" onChange={handleInputChange} />
        <button>Register</button>
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
  {
    register
  }
)( Register );
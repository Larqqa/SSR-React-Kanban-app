import React, { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../reducers/userReducer';

const Login = ( props ) => {
  const [ username, setUserName ] = useState('');
  const [ pass, setPass ] = useState('');

  const handleInputChange = (e) => {
    if (e.target.name === 'username') {
      setUserName(e.target.value);
    } else {
      setPass(e.target.value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const obj = {
      username: e.target.username.value,
      password: e.target.password.value
    };
    
    props.login(obj);
    
    setPass('');
  };

  return (
    <div className="block">
      <h3>Login</h3>
      <form className="login" onSubmit={handleLogin}>
        <input value={username} placeholder="username" type="text" name="username" onChange={handleInputChange} />
        <input value={pass} placeholder="password" type="password" name="password" onChange={handleInputChange} />
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
  {
    login
  }
)( Login );


import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
await fetch('http://localhost:4000/register',{
  method:'POST',
  body:JSON.stringify({username,password}),
  headers:{'Content-type':'application/json'}
})
  };

  return (
    <div>
    <h1 style={{textAlign:'center'}} >Register</h1>
      <form className="register" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder='username'
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder='password'
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={{width:'100%'}} type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;

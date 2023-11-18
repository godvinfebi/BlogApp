
import React, { useContext, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null; // Handle the case where the user is not logged in or the request fails
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
      });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(() => {
        setUserInfo(null); // Clear the user info after logging out
      });
  }

  const username = userInfo?.username;

  return (
    <div>
      <header>
        <Link to="/" className="logo">
          MYBlog
        </Link>
        <nav>
          {username ? ( // Check if username is not null or undefined
            <>
           
              <Link to="/create">Create new post</Link>
              <a onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}

export default Header;

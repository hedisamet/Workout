import React, { useState, useEffect } from 'react';
import './Header.css'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const handleLoginStatusChange = async () => {
      const status = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(status);
      
      if (status) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            console.log('Fetching user data for ID:', userId);
            const response = await axios.get(`http://localhost:3001/api/account/${userId}`);
            console.log('User data response:', response.data);
            
            if (response.data.status === 'success' && response.data.data) {
              setUsername(response.data.data.username);
            } else {
              console.error('No username in response:', response.data);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      } else {
        setUsername('');
      }
    };

    handleLoginStatusChange();
    window.addEventListener('storage', handleLoginStatusChange);
    window.addEventListener('loginSuccess', handleLoginStatusChange);

    return () => {
      window.removeEventListener('storage', handleLoginStatusChange);
      window.removeEventListener('loginSuccess', handleLoginStatusChange);
    };
  }, []);

  return (
    <div className="header">
      <img src={logo} alt="" className="logo" />
      <div className="Header-menu">
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/#Programms">
          <button>Programms</button>
        </Link>
        <Link to="/#Plans">
          <button>Join Now</button>
        </Link>
        <Link to="/#Reasons">
          <button>About us</button>
        </Link>
        {isLoggedIn ? (
          <>
            <Link to={`/account/${localStorage.getItem('userId')}`}>
              <button>{username || 'Account'}</button>
            </Link>
            <button onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userId');
              localStorage.removeItem('username');
              window.dispatchEvent(new Event('logout'));
              navigate('/');
            }}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;

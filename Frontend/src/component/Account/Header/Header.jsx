import React, { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";
import './Header.css'
import axios from 'axios';

const Header = () => {
  const [username, setUsername] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      console.log('Header - Fetching user data for ID:', userId);

      axios.get(`http://localhost:3001/api/account/${userId}`)
        .then(response => {
          console.log('Header - User data response:', response.data);
          if (response.data.status === 'success' && response.data.data) {
            setUsername(response.data.data.username);
          } else {
            console.error('Header - Invalid response format:', response.data);
          }
        })
        .catch(error => {
          console.error('Header - Error fetching user data:', error);
          if (error.response) {
            console.error('Header - Error response:', error.response.data);
          }
        });
    }

    // Format current date
    const updateDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = now.toLocaleString("en-US", { month: "long" });
      const year = now.getFullYear();
      const weekday = now.toLocaleString("en-US", { weekday: "long" });
      const formattedDate = `${month} ${day}, ${year}, ${weekday}`;
      setCurrentDateTime(formattedDate);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="header">
      <div className="nameDateMsg">
        <h2>
          <span id="hello">Hello,</span>{username ? ` ${username}` : ''} <span id="hello">!</span>
        </h2>
      </div>
      <div className="nameDateMsg">
        <p id="date">{currentDateTime}</p>
        <p id="bell"><FaBell /></p>
      </div>
    </div>
  );
};

export default Header;
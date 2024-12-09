import React from "react";
import {
  FaHome,
  FaUser,
  FaDumbbell,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import './SideNav.css'

const SideNav = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");
    if (shouldLogout) {
      // Clear all stored data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      window.dispatchEvent(new Event('logout'));
      // Navigate to home page
      navigate('/');
    }
  };

  return (
    <div className="SideNav">
      <div className="Nav">
        <ul>
          <Link to="/" className="navItem">
            <li>
              <FaHome />
              <br />
              Home
            </li>
          </Link>
          <Link to={`/account/${userId}`} className="navItem">
            <li>
              <FaUser />
              <br />
              Profile
            </li>
          </Link>
          <Link to={`/account/${userId}/program`} className="navItem">
            <li>
              <FaDumbbell />
              <br />
              Program
            </li>
          </Link>
          <Link to={`/meals/${userId}`} className="navItem">
            <li>
              <GiMeal />
              <br />
              Meals
            </li>
          </Link>
          <li className="navItem" onClick={handleLogout}>
            <FaSignOutAlt />
            <br />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;

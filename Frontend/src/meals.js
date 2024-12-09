import React from 'react';
import Header from './component/Account/Header/Header';
import SideNav from './component/Account/SideNav/SideNav';
import Meals from './component/Account/Meals/Meals';
import Footer from './component/Footer/Footer';
import './component/Account/account.css';

const MealsPage = () => {
  return (
    <div className="App1">
      <SideNav />
      <div className="main-content">
        <Header />
        <Meals />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default MealsPage;

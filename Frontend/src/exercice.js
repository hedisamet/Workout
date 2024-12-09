import React from 'react'
import Exeecice from './component/Account/programm/exeecice'
import SideNav from "./component/Account/SideNav/SideNav";
import Header from './component/Account/Header/Header';
import Footer from './component/Footer/Footer';
const exercice = () => {
  return (
    <div>
     <SideNav />
     <Header />
     <Exeecice />
     <Footer/>
    </div>
  )
}

export default exercice

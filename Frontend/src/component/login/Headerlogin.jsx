import React from "react";
import './Headerlogin.css'
import logo from '../../assets/logo.png'

const Header = () => {
    return (
        <div className="header">
            <img src={logo} alt="" className="logo" />
            <div className="Header-menu">
                <a href="/">
                    <button className="ssi">Home</button>
                </a>
            </div>
        </div>
    )
}

export default Header;

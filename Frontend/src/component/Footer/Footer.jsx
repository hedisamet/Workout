import React from 'react'
import './Footer.css'
import Logo from '../../assets/logo.png';

const Footer = () => {
    return (
        <div className="Footer-container">
            <div className="blur blur-f1"></div>
            <div className="blur blur-f"></div>
            <div className="footer">
                <div className="Logo-f">
                    <img src={Logo} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Footer

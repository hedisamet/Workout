import React, { useState, useEffect } from "react";
import './Hero.css'
import Header from "./Header/Header";
import heart from "../assets/heart.png";
import hero_image_back from "../assets/hero_image_back.png"
import hero_image from "../assets/hero_image.png"
import calories from "../assets/calories.png"
import { motion } from "framer-motion";

function Hero() {
    const transition = { duration: 3, type: 'spring' };
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {
        const handleLoginStatusChange = () => {
            setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        };

        window.addEventListener('loginSuccess', handleLoginStatusChange);
        window.addEventListener('logout', handleLoginStatusChange);

        return () => {
            window.removeEventListener('loginSuccess', handleLoginStatusChange);
            window.removeEventListener('logout', handleLoginStatusChange);
        };
    }, []);

    return (
        <div className="hero">
            <div className="blur blur-h"></div>
            <div className="left-h">
                <Header />
                <div className="the-best-ad">
                    <motion.div
                        initial={{ left: '128px' }}
                        whileInView={{ left: '8px' }}
                        transition={{ ...transition, type: 'tween' }}
                    >

                    </motion.div>
                    <span>
                        The Best Fitness Club
                    </span>
                </div>
                <div className="hero-text">
                    <div>
                        <span className="stroke-text">SHAPE</span>
                        <span> YOUR</span>
                    </div>
                    <div><span>IDEAL BODY</span></div>
                    <div>
                        <span>
                            HERE WE WILL HELP YOU TO SHAPE AND BUILD
                            YOUR IDEAL BODY AND LIVE UP YOUR LIFE TO FULLEST
                        </span>
                    </div>
                </div>
                <div className="figures">
                    <div>
                        <span>+140</span>
                        <span>EXPERT COACHES</span>
                    </div>
                    <div>
                        <span>+978</span>
                        <span>MEMBER JOINED</span>
                    </div>
                    <div>
                        <span>+50</span>
                        <span>FITNESS PROGRAMS</span>
                    </div>
                </div>
                <div className="hero-buttons">
                    <button className="btn">Get Started</button>
                    <button className="btn">Learn More</button>
                    {isLoggedIn ? (
                        <button className="btn">Account</button>
                    ) : (
                        <button className="btn">Login</button>
                    )}
                </div>
            </div>
            <div className="right-h" >
                <motion.div className="heart-rate"
                    initial={{ right: '-1rem' }}
                    whileInView={{ right: '4rem' }}
                    transition={{ ...transition, type: 'tween' }}
                >
                    <img src={heart} alt="" />
                    <span>Heart Rate</span><span>116 bpm</span>
                </motion.div>
                <img src={hero_image} alt="" className="hero-image" />
                <motion.img
                    initial={{ right: '11rem' }}
                    whileInView={{ right: '20rem' }}
                    transition={{ ...transition, type: 'tween' }}
                    src={hero_image_back} alt="" className="hero-image-back" />

                <div className="calories">
                    <img src={calories} alt="" />
                    <div>
                        <span>Calories Burned</span>
                        <span>220 kcal</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
export default Hero;
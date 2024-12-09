import React from 'react';
import "./Plans.css";
import whiteTick from '../../assets/whiteTick.png';
import { plansData } from '../../data/plansData';
import { Link } from 'react-router-dom';

const Plans = () => {
    return (
        <div className="plans-container">
            <div className="programms-header" style={{ gap: "2rem" }}>
                <span className='stroke-text'>READY TO START</span>
                <span>YOUR JOURNEY</span>
                <span className='stroke-text'>NOW WITH US</span>
            </div>
            {/* plans card */}
            <div className="blur blur-p"></div>
            <div className="blur blur-p2"></div>
            <div className="plans">
                {plansData.map((plan, planIndex) => (
                    <div className="plan" key={planIndex}>

                        {plan.icon}

                        <span>{plan.name}</span>

                        <span>{plan.price}</span>

                        <div className="features">

                            {plan.features.map((feature, featureIndex) => (
                                <div className="feature" key={featureIndex}>
                                    <img src={whiteTick} alt="" />
                                    <span>{feature}</span>
                                </div>
                            ))}

                        </div>
                        <Link to="/paiment" >
                        <button>Pay Now</button>
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Plans;

import React from 'react'
import "./Programms.css"
import { programsData } from "../../data/programsData"
import { Link } from 'react-router-dom'
const Programms = () => {
    return (
        <div>
            <div className="programms" id="programms">
                {/*programms-header*/}
                <div className="programms-header">
                    <span className='stroke-text'>
                        Explore Our
                    </span>
                    <span>
                        Programms
                    </span>
                    <span className='stroke-text'>
                        To Shape You
                    </span>


                </div>
                <div className="program-categories">
                    {programsData.map((program, index) => (
                        <div key={index} className="category">
                            {program.image}
                            <span>{program.heading}</span>
                            <span>{program.details}</span>
                            <div className="join-now">
                            <Link to="/Planning">
                                <button>See More</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Programms

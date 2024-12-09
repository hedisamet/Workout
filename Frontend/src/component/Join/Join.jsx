import React from 'react'
import './Join.css'
import { Link } from 'react-router-dom'

const Join = () => {
    return (
        <div className="Join" id="join-us">
            <div className="left-j">
                <hr />
                <div>
                    <span className='stroke-text'>READY TO</span>
                    <span> LEVEL UP</span>
                </div>
                <div>
                    <span>YOUR BODY</span>
                    <span className='stroke-text'> WITH US?</span>
                </div>
            </div>
            <div className="right-j">
                
                    <Link to="/Registration">
                    <button className='btn btn-j'>Join Now</button>
                    </Link>
                
            </div>
        </div>
    )
}

export default Join

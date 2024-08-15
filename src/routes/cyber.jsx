import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from "../components/LogIn.jsx"

import CyberSci from "../assets/cyber/CyberSci.png"

export default function Cyber() {  
    return (
        <div className="cyber-main">
            {/* {Cookies.get("user-login") ? null : <Login/>} */}
            <div className= "cyber-timeline"></div>
            <div className= "cyber-competitions">
                <div className= "cyber-event">
                    <img className = "cyber-display" src = {CyberSci}/>
                    <div className = "cyber-divider"></div>
                    <p className = "cyber-title">
                        Alberta Regionals
                    </p>
                    <p className = "cyber-tagline">
                        uAlberta: 3rd Place
                    </p>
                </div>
                
            </div>
        </div>
    );
  }
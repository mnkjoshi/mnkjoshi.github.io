import { Outlet, useNavigate } from "react-router-dom";
import MoonIcon from "../assets/images/MoonIcon.png"

export default function TopBar({ HandleClick }) {
    if (HandleClick == null) {
        setTimeout(function() { 
            document.getElementById("topbar-main").style.transition = "0.5s"
            document.getElementById("topbar-main").style.marginTop = "-6%"
        }, 100)
    }
     else {
        setTimeout(function() { 
            document.getElementById("topbar-main").style.marginTop = "0%"
        }, 500)
     }

    

    return (
        <div className="topbar-main" id= "topbar-main">
        <p className  = "topbar-title">mnkjoshi</p>
        <div className = "topbar-divider"></div>
        <div className = "topbar-buttons">
            {/* <button onClick={() => HandleClick(1)} className="topbar-button">Home</button> */}
            <button onClick={() => HandleClick(2)} className="topbar-button">Projects</button>
            <button onClick={() => HandleClick(3)} className="topbar-button">Cyber</button>
            <button onClick={() => HandleClick(4)} className="topbar-button">R&eacute;sum&eacute;</button>
            <button onClick={() => HandleClick(5)} className="topbar-button">Resources</button>
            <button onClick={() => HandleClick(6)} className="topbar-button">Portal</button>
        </div>
        <div className = "topbar-divider"></div>
        <div className = "topbar-toggles">
            
            <button className = "topbar-mode-toggle"><img className = "topbar-mode-icon" src = {MoonIcon}/></button>
            <button className = "topbar-logout"  onClick={() => HandleClick(1)}>Home</button>
        </div>
    </div>
    );
  }
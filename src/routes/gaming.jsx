import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from "../components/LogIn.jsx"

export default function Gaming() {  
    return (
        <div className="cyber-main">
            {/* {Cookies.get("user-login") ? null : <Login/>} */}
            <div className= "cyber-timeline"></div>
            <div className= "cyber-section">
                <div className= "cyber-pointer"></div>
            </div>
        </div>
    );
  }
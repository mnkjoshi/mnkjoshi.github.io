import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from "../components/LogIn.jsx"

export default function Cyber() {  
    return (
        <div className="cyber-main">
            {Cookies.get("user-login") ? null : <Login/>}
        </div>
    );
  }
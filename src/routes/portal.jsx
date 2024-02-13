import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from "../components/LogIn.jsx"

export default function Portal() {  
    return (
        <div className="portal-main">
            {Cookies.get("user-login") ? null : <Login/>}
        </div>
    );
  }
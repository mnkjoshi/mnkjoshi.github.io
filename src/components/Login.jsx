import { useNavigate } from "react-router-dom";

export default function Login({ HandleClick, OriginalTarget }) {

    return (
        <div className= "login-main" id= "login-main">
            <p className= "login-title"> Log in to continue. </p>
            <input class = "login-user" id = "login-user" placeholder = "Username"/>
            <input class = "login-pass" id = "login-pass" placeholder = "Password" type = "password"/>
            <button onClick={HandleClick} class="login-enter">SUBMIT</button>
        </div>
    );
  }
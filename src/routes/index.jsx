import { useNavigate } from "react-router-dom";


export default function Index() {  
    console.log("Hello??")
    return (
        <div className= "index-main">
            <div className = "index-content">
                <p className= "index-message"> I am<span className= "index-description"> a Student</span></p>
            </div>
        </div>
    );
  }
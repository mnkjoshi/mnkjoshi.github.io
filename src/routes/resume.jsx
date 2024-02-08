import { useNavigate } from "react-router-dom";
import ResumeFile from "../assets/data/resume.pdf"


export default function Resume() {  
    return (
        <div className="resume-main">
            <object className="resume-display" type="application/pdf" data={ResumeFile}>

            </object>
        </div>
    );
  }
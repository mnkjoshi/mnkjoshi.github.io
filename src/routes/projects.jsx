import { useNavigate } from "react-router-dom";
import GitHubIcon from "../assets/images/GitHubIcon.png"
import YouTubeIcon from "../assets/images/YouTubeIcon.png"

const allProjects = {
    ["names"]:["UtiliSee", "SafetyVision", "WatchDog", "VitaliSee", "WildFire", "LoopCar"],
}

function transitionTool(opacity, position, object) {
    object.style.opacity = opacity;
    object.style.position = position;
    if (opacity == "0") {
        object.remove
    }
}   

export default function Projects() {  

    return (
        <div className="projects-main">
            <p className= "projects-title">
                {"<Project Title>"}
            </p>
            
            <div className= "projects-slider">
                <button className= "projects-toggle proj-tog-1" id= "left-toggle"> 
                    {"<"}
                </button>
                <div className= "projects-display proj-disp-0" id= "proj-disp-0">
                    <img></img>
                </div>
                <div className= "projects-display proj-disp-1" id= "proj-disp-1">
                    <img></img>
                </div>
                <div className= "projects-display proj-disp-2" id= "proj-disp-2">
                    
                </div>
                <div className= "projects-display proj-disp-3" id= "proj-disp-3">
                    
                </div>
                <div className= "projects-display proj-disp-4" id= "proj-disp-4">
                    <img></img>
                </div>
                <button className= "projects-toggle proj-tog-2" id= "right-toggle"> 
                    {">"}
                </button>
            </div>
            <div className= "projects-info">
                <div className= "projects-actions">
                    <button className= "projects-git">
                        <img src = {GitHubIcon} className= "projects-github-icon"/>
                    </button>

                    <button className= "projects-yt">
                        <img src = {YouTubeIcon} className= "projects-yt-icon"/>
                    </button>

                    <button className= "projects-demo">
                        LIVE
                    </button>
                </div>
                <p className= "projects-description">
                    Placeholder.
                </p>
                <div className= "projects-stack">
                    <p className= "projects-stack-intro">Technologies Used</p>
                    <div className= "projects-stack-display">
                        <div className= "projects-stack-component">
                            <img className= "projects-stack-icon"/>
                            <p className= "projects-stack-name">REACT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  } 
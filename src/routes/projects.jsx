import { useNavigate } from "react-router-dom";

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
                SafetyVision
            </p>
            
            <div className= "projects-slider">
                <button className= "projects-toggle" id= "left-toggle"> 
                    {"<"}
                </button>
                <div className= "projects-display">

                </div>
                <div className= "projects-display">
                    
                </div>
                <div className= "projects-display">
                    
                </div>
                <button className= "projects-toggle" id= "right-toggle"> 
                    {">"}
                </button>
            </div>
            <div className= "project-actions">
                
            </div>
            <p className= "projects-description">

            </p>
        </div>
    );
  }
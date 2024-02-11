import { useNavigate } from "react-router-dom";

import MadeWith from "../components/MadeWith.jsx"

import GitHubIcon from "../assets/images/GitHubIcon.png"
import YouTubeIcon from "../assets/images/YouTubeIcon.png"
import ProjectData from "../assets/data/ProjectData.js";

let CurrentProject = 0;

function transitionTool(opacity, position, object) {
    object.style.opacity = opacity;
    object.style.position = position;
    if (opacity == "0") {
        object.remove
    }
}   

let ProjectToShow = null;



export default function Projects() { 
    let ProjectToShow = ProjectData[2];
    function HandleClick(Where) {
        console.log(ProjectToShow)
        if (Where == "yt") {
            if (ProjectToShow !== null && ProjectToShow.yt !== null) {
                window.open(ProjectToShow.yt)
            }
        } else if (Where == "github") {
            if (ProjectToShow !== null && ProjectToShow.github !== null) {
                window.open(ProjectToShow.github)
            }
        } else if (Where == "live") {
            if (ProjectToShow !== null && ProjectToShow.live !== null) {
                window.open(ProjectToShow.live)
            }
        }
    }

    return (
        <div className="projects-main">
            <p className= "projects-title">
                {ProjectToShow.title}
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
                        <img src = {GitHubIcon} className= "projects-github-icon" onClick={() => HandleClick("github")}/>
                    </button>

                    <button className= "projects-yt">
                        <img src = {YouTubeIcon} className= "projects-yt-icon" onClick={() => HandleClick("yt")}/>
                    </button>

                    <button className= "projects-demo" onClick={() => HandleClick("live")}>
                        LIVE
                    </button>
                </div>
                <p className= "projects-description">
                    {ProjectToShow.description}
                </p>
                <div className= "projects-stack">
                    <p className= "projects-stack-intro">Technologies Used</p>
                    { ProjectToShow !== null ? <MadeWith Project={ProjectToShow}/> : null}
                </div>
            </div>
        </div>
    );
  } 
import { useNavigate } from "react-router-dom";

import MadeWith from "../components/MadeWith.jsx"

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
    //[ReactIcon, FirebaseIcon, PythonIcon, NodeJSIcon, Viteicon, MongoIcon, FlaskIcon, ExpressIcon, JavaScriptIcon, VueIcon]
    const ProjectToShow = [{
        stack: [
        {
            logo: 0,
            title: "React",
        },
        {
            logo: 1,
            title: "Firebase",
        },
        {
            logo: 2,
            title: "Python",
        },
        {
            logo: 3,
            title: "NodeJS",
        },
        {
            logo: 4,
            title: "Vite",
        },
        {
            logo: 6,
            title: "Flask",
        },
        {
            logo: 8,
            title: "JavaScript",
        },
        ]
    }] 

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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquam dignissim risus in auctor. Nam facilisis lectus quis ante tristique, a vehicula nisl pellentesque. Maecenas malesuada risus id lacus consequat, at lacinia mi aliquam. In dignissim orci ac sem rutrum, molestie porttitor mauris venenatis. Donec lobortis ullamcorper metus, ac feugiat lacus facilisis sed. Cras ac nunc non lectus tincidunt fermentum ut et mauris. Donec a nibh elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris sed posuere metus. Duis non nulla a quam pretium congue.
                </p>
                <div className= "projects-stack">
                    <p className= "projects-stack-intro">Technologies Used</p>
                    { ProjectToShow !== null ? <MadeWith Project={ProjectToShow}/> : null}
                </div>
            </div>
        </div>
    );
  } 
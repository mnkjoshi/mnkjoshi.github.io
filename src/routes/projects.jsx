import { useNavigate } from "react-router-dom";

import MadeWith from "../components/MadeWith.jsx"

import GitHubIcon from "../assets/images/GitHubIcon.png"
import YouTubeIcon from "../assets/images/YouTubeIcon.png"
import ProjectData from "../assets/data/projectData.js";

import VitaliSee from "../assets/displays/VitaliSee.png"
import UtiliSee from "../assets/displays/UtiliSee.png"
import SafetyVision from "../assets/displays/SafetyVision.png"
import GamEE from "../assets/displays/GamEE.png"
import WatchDog from "../assets/displays/WatchDog.png"
import LoopCar from "../assets/displays/LoopCar.jpg"
import CitiWatch from "../assets/displays/CitiWatch.png"

const ProjectDisplays = {
    ["VitaliSee"]: VitaliSee,
    ["UtiliSee"]: UtiliSee,
    ["SafetyVision"]: SafetyVision,
    ["GamEE Lite"]: GamEE,
    ["WatchDog"]: WatchDog,
    ["LoopCar"]: LoopCar,
    ["CitiWatch"]: CitiWatch,
}

import { useState } from "react";

let DisplayOrder = [1, 2, 3, 4, 5]
let DisplayIndex = [0, 1, 2, 3, 4]
let ProjectToShow = null;

export default function Projects() { 
    const [current, setCurrent] = useState(0)

    function displayAlign(listOrder) {
        let display = document.getElementById("proj-disp-" + listOrder);
        if (window.innerWidth <= 700) { // Mobile
            switch (DisplayOrder[listOrder]) {
                case 1:
                    display.style.opacity = "0";
                    display.style.width = "0";
                    display.style.height = "0";
                    display.style.left = "0%";
                    display.style.top = "24%";
                    display.style.zIndex = "3"
                    break;
                case 2:
                    display.style.opacity = "0.5";
                    display.style.width = "27%";
                    display.style.height = "17%";
                    display.style.left = "18%";
                    display.style.top = "24%";
                    display.style.zIndex = "4";
                    display.style.marginTop = "5%";
                    break;
                case 3:
                    display.style.opacity = "1";
                    display.style.width = "30%";
                    display.style.height = "20%";
                    display.style.left = "35%";
                    display.style.top = "22%";
                    display.style.zIndex = "5";
                    display.style.marginTop = "6%";
                    break;
                case 4:
                    display.style.opacity = "0.5";
                    display.style.width = "27%";
                    display.style.height = "17%";
                    display.style.left = "55%";
                    display.style.top = "24%";
                    display.style.zIndex = "4";
                    display.style.marginTop = "5%";
                    break;
                case 5:
                    display.style.opacity = "0";
                    display.style.width = "0";
                    display.style.height = "0";
                    display.style.left = "100%";
                    display.style.top = "24%";
                    display.style.zIndex = "3"
                    break;
                default:
                    break;
            }
        } else { // PC
            switch (DisplayOrder[listOrder]) {
                case 1:
                    display.style.opacity = "0";
                    display.style.width = "0";
                    display.style.height = "0";
                    display.style.left = "0%";
                    display.style.top = "25%";
                    display.style.zIndex = "3"
                    break;
                case 2:
                    display.style.opacity = "0.5";
                    display.style.width = "27%";
                    display.style.height = "30%";
                    display.style.left = "18%";
                    display.style.top = "24%";
                    display.style.zIndex = "4";
                    break;
                case 3:
                    display.style.opacity = "1";
                    display.style.width = "30%";
                    display.style.height = "35%";
                    display.style.left = "35%";
                    display.style.top = "22%";
                    display.style.zIndex = "5 ";
                    break;
                case 4:
                    display.style.opacity = "0.5";
                    display.style.width = "27%";
                    display.style.height = "30%";
                    display.style.left = "55%";
                    display.style.top = "24%";
                    display.style.zIndex = "4";
                    break;
                case 5:
                    display.style.opacity = "0";
                    display.style.width = "0";
                    display.style.height = "0";
                    display.style.left = "100%";
                    display.style.top = "25%";
                    display.style.zIndex = "3"
                    break;
                default:
                    break;
            }
        }
    }
    
    function switchProject(right) {
        let direction = (right == null ? -1 : 1);
        let indexDirection = (right == null ? 1 : -1);
        let max = (right == null ? 1 : 5);
        let reset = (right == null ? 5 : 1);
        
        for (let listOrder = 0; listOrder < 5; listOrder++) {
            if(DisplayOrder[listOrder] == max) {
                DisplayOrder[listOrder] = reset;
            } else {
                DisplayOrder[listOrder] += direction;
            }
            
            if(DisplayIndex[listOrder] == (ProjectData.length - 1) && indexDirection == 1) {
                DisplayIndex[listOrder] = 0;
            } else if(DisplayIndex[listOrder] == 0 && indexDirection == -1) {
                DisplayIndex[listOrder] = (ProjectData.length - 1);
            } else {
                DisplayIndex[listOrder] += indexDirection;
            }
            displayAlign(listOrder)
        }
        setCurrent(DisplayIndex[2])
    }

    ProjectToShow = ProjectData[DisplayIndex[2]]

    function HandleClick(Where) {
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
            <p className= "projects-tagline">
                {ProjectToShow.tagline}
            </p>

            <p className= "projects-title">
                {ProjectToShow.title}
            </p>

            <div className= "projects-slider">
                <button className= "projects-toggle proj-tog-1" id= "left-toggle" onClick= {() => switchProject(true)}> 
                    {"<"}
                </button>
                <div className= "projects-display proj-disp-0" id= "proj-disp-0">
                    <img id= "proj-img-0" src= {ProjectDisplays[ProjectData[DisplayIndex[DisplayOrder[0]-1]].title]} className= "projects-display-image"></img>
                </div>
                <div className= "projects-display proj-disp-1" id= "proj-disp-1">
                    <img id= "proj-img-1" src= {ProjectDisplays[ProjectData[DisplayIndex[DisplayOrder[1]-1]].title]} className= "projects-display-image"></img>
                </div>
                <div className= "projects-display proj-disp-2" id= "proj-disp-2">
                    <img id= "proj-img-2" src= {ProjectDisplays[ProjectData[DisplayIndex[DisplayOrder[2]-1]].title]} className= "projects-display-image"></img>
                </div>
                <div className= "projects-display proj-disp-3" id= "proj-disp-3">
                    <img id= "proj-img-3" src= {ProjectDisplays[ProjectData[DisplayIndex[DisplayOrder[3]-1]].title]} className= "projects-display-image"></img>
                </div>
                <div className= "projects-display proj-disp-4" id= "proj-disp-4">
                    <img id= "proj-img-4" src= {ProjectDisplays[ProjectData[DisplayIndex[DisplayOrder[4]-1]].title]} className= "projects-display-image"></img>
                </div>
                <button className= "projects-toggle proj-tog-2" id= "right-toggle" onClick= {() => switchProject()}> 
                    {">"}
                </button>
            </div>
            <div className= "projects-info">
                <div className= "projects-actions">

                    {ProjectToShow.github !== null ? 
                    <button className= "projects-git">
                        <img src = {GitHubIcon} className= "projects-github-icon" onClick={() => HandleClick("github")}/>
                    </button> 
                    : null
                    }
                    
                    {ProjectToShow.yt !== null ? 
                    <button className= "projects-yt">
                        <img src = {YouTubeIcon} className= "projects-yt-icon" onClick={() => HandleClick("yt")}/>
                    </button> 
                    : null
                    }

                    {ProjectToShow.live !== null ? 
                    <button className= "projects-demo" onClick={() => HandleClick("live")}>
                        LIVE
                    </button>
                    : null
                    }
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
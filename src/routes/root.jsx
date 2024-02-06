import { Outlet, useNavigate, useLocation } from "react-router-dom";
let shown = false;
import TopBar from "../components/TopBar";
import MobileBar from "../components/MobileBar";
import LoadingScreen from "../components/LoadingScreen"

import Cookies from 'js-cookie';
let currentRoute = 1;
let device = 1;
let transferring = false;
import React, { useState } from 'react'

function activateToggles(mode, direction, first) {
    if (device == 1) {
        if (document.getElementById("landing-toggle-6").style.opacity == mode) { return }
        
    } else {
        if (document.getElementById("landing-toggle-5").style.opacity == mode) { return }
    }
    setTimeout(function() {
        document.getElementById("landing-toggle-1").style.opacity = mode;
        document.getElementById("landing-toggle-1").style.transform = direction;
    }, first * 1)
    setTimeout(function() {
        document.getElementById("landing-toggle-2").style.opacity = mode;
        document.getElementById("landing-toggle-2").style.transform = direction;
    }, first * 2)
    setTimeout(function() {
        document.getElementById("landing-toggle-3").style.opacity = mode;
        document.getElementById("landing-toggle-3").style.transform = direction;
    }, first * 3)
    setTimeout(function() {
        document.getElementById("landing-toggle-4").style.opacity = mode;
        document.getElementById("landing-toggle-4").style.transform = direction;
    }, first * 4)
    setTimeout(function() {
        document.getElementById("landing-toggle-5").style.opacity = mode;
        document.getElementById("landing-toggle-5").style.transform = direction;
    }, first * 5)
    if (device == 1) {
        setTimeout(function() {
            document.getElementById("landing-toggle-6").style.opacity = mode;
            document.getElementById("landing-toggle-6").style.transform = direction;
        }, first * 6)
        setTimeout(function() {
            document.getElementById("landing-welcome").style.transition = "0.5s";
            document.getElementById("landing-welcome").style.color = "white";
        }, (first * 6))
    } else {
        setTimeout(function() {
            document.getElementById("landing-welcome").style.transition = "0.5s";
            document.getElementById("landing-welcome").style.color = "white";
        }, (first * 5))
    }
    
}
function typer(message, textTicker) {
    if(document.getElementById("landing-welcome").innerHTML.length >= message.length) { return }
    document.getElementById("landing-welcome").innerHTML = message.substring(0, textTicker);
    if (textTicker < message.length) {
        textTicker++;
        setTimeout(function() {typer(message, textTicker)}, 60);
    } else {
        return true;
    }
}
function deleter(textTicker) {
    document.getElementById("landing-welcome").innerHTML = document.getElementById("landing-welcome").innerHTML.substring(0, textTicker);
    if (textTicker > 0) {
        textTicker--;
        setTimeout(function() {deleter(textTicker)}, 60);
    } else {
        return true;
    }
}


export default function Root() {  
    const [status, setStatus] = useState(0);
    const [first, setFirst] = useState(0);
    const [movement, setMove] = useState(0);
    let location = useLocation();
    const navigate = useNavigate();
    let dashBarTransition;

    if (window.innerWidth <= 700) { // Mobile
        dashBarTransition = "translateY(-5px)"
        device = 2;
    } else { // PC
        dashBarTransition = "translateX(10px)"
        device = 1;
    }
    
    if(first == 0) {
        if (!(location.pathname == "/")) {
            setTimeout(function() {
                Navigation(1, true)
                setFirst(1)
            }, 100)
        } else {
            setFirst(1)
        }
    }

    if(status == 0 || status == 2) {
        setTimeout(function() {
            document.getElementById("landing-welcome").style.opacity = 1;
            document.getElementById("landing-welcome").style["align-items"] = "start";
            if (Cookies.get("darkOrLight") !== null) {
                if (Cookies.get("darkOrLight") == "light") {
                    document.getElementById("html").style["mix-blend-mode"] = "difference";
                }
            }
        }, 10)
        
        setTimeout(function() { 
            typer("Manav Joshi", 0)
            activateToggles("1", dashBarTransition, 400)
        }, 1000)
        if (device == 2 && status == 0) {
            setStatus(2)
        }
    }


    
    function Navigation(Route, override) {
        if (currentRoute == Route && override == null) { return }
        console.log(Route)
        if (Route == -2) {
            console.log(document.getElementById("html").style["mix-blend-mode"])
            if(document.getElementById("html").style["mix-blend-mode"] == "difference") {
                document.getElementById("html").style["mix-blend-mode"] = "normal";
                Cookies.set("darkOrLight", "dark")
            } else {
                document.getElementById("html").style["mix-blend-mode"] = "difference";
                Cookies.set("darkOrLight", "light")
            }
            
            return
        }

        let timeToWait = 500;
        if (Route !== 1) { 
            document.getElementById("landing-outlet").style.opacity = 0; 
        } else { 
            document.getElementById("landing-outlet").style.opacity = 1; 
            timeToWait = 0 
        }
        setTimeout(function() {
            switch (Route) {
                case -1:
                    navigate("/", true);
                    break;
                case 1:
                    navigate("/", true);
                    break;
                case 2:
                    navigate("/projects");
                    break;
                case 3:
                    navigate("/cyber");
                    break;
                case 4:
                    navigate("/resume");
                    break;
                case 5:
                    navigate("/resources");
                    break;
                case 6:
                    navigate("/portal");
                    break;
            }
            if (Route !== 1 && Route !== -1 && device == 1) {
                activateToggles("0", dashBarTransition, 100);
                deleter("Manav Joshi".length);      
                currentRoute = Route
                transferring = true;
                if (status == 1) {
                    setMove(movement + 1);
                } else {
                    setStatus(1);
                }
                setTimeout(function() { 
                    if (currentRoute !== 1) {
                        document.getElementById("landing-switches").style.width = "0%";
                    }
                    document.getElementById("landing-outlet").style.opacity = 1;
                    transferring = false;
                }, 2000)
            } else if ((Route == 1 || Route == -1)  && device == 1) {
                transferring = false;
                document.getElementById("landing-switches").style.width = "18%";
                activateToggles("1", dashBarTransition, 100);
                typer("Manav Joshi", 0);
                currentRoute = 1    
                setStatus(0);
            } else if (Route !== 1 && Route !== -1 && device == 2) { // Mobile topbar
                transferring = true;
                currentRoute = Route
                setStatus(3)
                setTimeout(function() { 
                    document.getElementById("landing-outlet").style.opacity = 1;
                    transferring = false;
                }, 2000)
            } else if (Route == 1 || Route == -1  && device == 2) { // Mobile hide topbar
                transferring = false;
                currentRoute = 1 
                setStatus(2)
                setTimeout(function() { 
                    document.getElementById("landing-outlet").style.opacity = 1;
                    transferring = false;
                }, 2000)
                
            }
        }, timeToWait)
    } //<TopBar HandleClick = {null}/>
    // if (target == 0) {
    //     setTimeout( function() {
    //         Navigation(1, true);
    //         setTarget(1)
    //     }, 1000)
    // }
    return (
        <div className= "landing-main" id= "landing-main">
            <div className= "animation-wrapper">
            </div>
            <div className= "landing-central">
                <p className= "landing-welcome" id= "landing-welcome"></p>
            </div>
            { transferring == true ? <LoadingScreen/> : null }
            { status == 0 ? <TopBar HandleClick = {null}/> : null } 
            { status == 1 ? <TopBar HandleClick = {Navigation}/> : null } 
            { status == 2 ? <MobileBar HandleClick = {Navigation} /> : null } 
            { status == 3 ? <MobileBar HandleClick = {Navigation}/> : null } 
            <div className= "landing-switches" id= "landing-switches">
                <button className= "landing-toggles" id= "landing-toggle-1" onClick={() => Navigation(1)}>
                    Home
                </button>
                <button className= "landing-toggles" id= "landing-toggle-2" onClick={() => Navigation(2)}>
                    Projects
                </button>
                <button className= "landing-toggles" id= "landing-toggle-3" onClick={() => Navigation(3)}>
                    Cyber
                </button>
                <button className= "landing-toggles" id= "landing-toggle-4" onClick={() => Navigation(4)}>
                    R&eacute;sum&eacute;
                </button>
                <button className= "landing-toggles" id= "landing-toggle-5" onClick={() => Navigation(5)}>
                    Resources
                </button>
                { device == 1 ? <button className= "landing-toggles" id= "landing-toggle-6" onClick={() => Navigation(6)}>
                    Portal
                </button> : null}
            </div>
            <div className= "landing-outlet" id= "landing-outlet">
                <Outlet/>
            </div>
      </div>
    );
  }
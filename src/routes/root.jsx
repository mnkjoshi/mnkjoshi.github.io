import { useNavigate } from "react-router-dom";
let shown = false;

export default function Root() {  

    if(shown) {

    } else {
        console.log("Go!")
        shown = true;
        setTimeout(function() {
            document.getElementById("landing-welcome").style.opacity = 1;
            document.getElementById("landing-welcome").style.transform = "translateY(-10px)";
            setTimeout(function() {
                document.getElementById("landing-welcome").style.opacity = 0;
                setTimeout(function() {
                    document.getElementById("landing-welcome").innerHTML = "My name is..."
                    document.getElementById("landing-welcome").style.opacity = 1;
                    setTimeout(function() {
                        document.getElementById("landing-welcome").style.transform = "translate(-25%, -160%)";
                        setTimeout(function() {
                            document.getElementById("landing-welcome").style.transition = "0s";
                            document.getElementById("landing-welcome").style.transform = "translate(4.8%, -160%)";
                            document.getElementById("landing-welcome").style.textAlign = "left";
                            document.getElementById("landing-welcome").style["align-items"] = "start";
                           deleter(document.getElementById("landing-welcome").innerHTML.length);
                            setTimeout(function() { 
                                typer("Manav Joshi", 0)
                                setTimeout(function() {
                                    document.getElementById("landing-toggle-1").style.opacity = "1";
                                    document.getElementById("landing-toggle-1").style.transform = "translateX(10px)";
                                }, 333)
                                setTimeout(function() {
                                    document.getElementById("landing-toggle-2").style.opacity = "1";
                                    document.getElementById("landing-toggle-2").style.transform = "translateX(10px)";
                                }, 666)
                                setTimeout(function() {
                                    document.getElementById("landing-toggle-3").style.opacity = "1";
                                    document.getElementById("landing-toggle-3").style.transform = "translateX(10px)";
                                }, 999)
                                setTimeout(function() {
                                    document.getElementById("landing-toggle-4").style.opacity = "1";
                                    document.getElementById("landing-toggle-4").style.transform = "translateX(10px)";
                                }, 1333)
                                setTimeout(function() {
                                    document.getElementById("landing-toggle-5").style.opacity = "1";
                                    document.getElementById("landing-toggle-5").style.transform = "translateX(10px)";
                                }, 1666)
                                setTimeout(function() {
                                    document.getElementById("landing-toggle-6").style.opacity = "1";
                                    document.getElementById("landing-toggle-6").style.transform = "translateX(10px)";
                                }, 1999)
                                setTimeout(function() {
                                    document.getElementById("landing-welcome").style.transition = "0.5s";
                                    document.getElementById("landing-welcome").style.color = "white";
                                }, 2000)
                            }, 1000)
                        }, 1000)
                    }, 1000)
                }, 1000)
            }, 1000)
        }, 1000)
    }
    
    function typer(message, textTicker) {
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
            setTimeout(function() {deleter(textTicker)}, 50);
        } else {
            return true;
        }
    }
    
    
   
    return (
        <div className= "landing-main" id= "landing-main">
            <div className= "animation-wrapper">
            </div>
            <div className= "landing-central">
                <p className= "landing-welcome" id= "landing-welcome">Hello</p>
            </div>
            <div className= "landing-switches" id= "landing-switches">
                <button className= "landing-toggle-1" id= "landing-toggle-1">
                    Home
                </button>
                <button className= "landing-toggle-2" id= "landing-toggle-2">
                    Projects
                </button>
                <button className= "landing-toggle-3" id= "landing-toggle-3">
                    Cyber
                </button>
                <button className= "landing-toggle-4" id= "landing-toggle-4">
                    Messages
                </button>
                <button className= "landing-toggle-5" id= "landing-toggle-5">
                    Resume
                </button>
                <button className= "landing-toggle-6" id= "landing-toggle-6">
                    Resources
                </button>
            </div>
      </div>
    );
  }
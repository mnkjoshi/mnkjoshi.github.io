import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
let currentMessage = 0
const allMessages = [" a Student."," an Engineer.", " a Programmer.", " a Developer.", " a Researcher.", " an Innovator.", " a Hacker."]
const allColors = ["orange", "blueviolet", "greenyellow", "orangered", "pink", "skyblue", "purple"]

function typer(message, textTicker) {
    if(document.getElementById("index-description") == null) { return }
    if(document.getElementById("index-description").innerHTML.length >= message.length) { return }
    document.getElementById("index-description").innerHTML = message.substring(0, textTicker);
    if (textTicker < message.length) {
        textTicker++;
        setTimeout(function() {typer(message, textTicker)}, 120);
        
    } else {
        setTimeout(function() {document.getElementById("index-ticker").innerHTML = ""}, 600)
        setTimeout(function() {document.getElementById("index-ticker").innerHTML = "|"}, 1200)

        setTimeout(function() {deleter(message.length)}, 1500);
    }
}
function deleter(textTicker) {
    if(document.getElementById("index-description") == null) { return }
    if(document.getElementById("index-ticker") == null) { return }
    document.getElementById("index-description").innerHTML = document.getElementById("index-description").innerHTML.substring(0, textTicker);
    if (textTicker > 0) {
        textTicker--;
        setTimeout(function() {deleter(textTicker)}, 100);
    } else {
        if (currentMessage >= allMessages.length - 1) {
            currentMessage = 0;
        } else {
            currentMessage++;
        }
        document.getElementById("index-description").style.color = allColors[currentMessage]
        setTimeout(function() {document.getElementById("index-ticker").innerHTML = ""}, 500)
        setTimeout(function() {document.getElementById("index-ticker").innerHTML = "|"}, 1000)
        setTimeout(function() {typer(allMessages[currentMessage], 0)}, 1000)
    }
}


export default function Index() {  
    setTimeout( function() {
        document.getElementById("index-content").style.opacity = "1";
        document.getElementById("index-content").style.transform = "translateY(10px)";
    }, 1000)

    setTimeout( function() {
        deleter(allMessages[currentMessage].length)
    }, 1500)
    return (
        <div className= "index-main">
            <div className = "index-content" id= "index-content">
                <p className= "index-message"> I am<span className= "index-desc ription" id= "index-description"> a Student.</span><span id="index-ticker">|</span></p>
                <p className= "index-intro">Hello there, thanks for checking out my website! 
                <br/>
                <br/>
                I'm Manav, a third year Electrical Engineering student at the University of Alberta. I'm passionate about software development, embedded systems programming, electrical engineering, and many other topics!
                <br/>
                <br/>
                You can learn more about me, my work, and my projects right here on this website. Check out the options for more info!
                </p>
            </div>
        </div>
    );
  }
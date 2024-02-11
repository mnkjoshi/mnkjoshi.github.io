import ReactIcon from "../assets/images/ReactIcon.png"
import FirebaseIcon from "../assets/images/FirebaseIcon.png"
import PythonIcon from "../assets/images/PythonIcon.png"
import NodeJSIcon from "../assets/images/NodeJSIcon.png"
import Viteicon from "../assets/images/Viteicon.png"
import MongoIcon from "../assets/images/MongoIcon.png"
import FlaskIcon from "../assets/images/FlaskIcon.png"
import ExpressIcon from "../assets/images/ExpressIcon.png"
import JavaScriptIcon from "../assets/images/JavaScriptIcon.png"
import VueIcon from "../assets/images/VueIcon.png"
import ArduinoIcon from "../assets/images/ArduinoIcon.png"
import CIcon from "../assets/images/CIcon.png"
import CppIcon from "../assets/images/CppIcon.png"
import HardwareIcon from "../assets/images/HardwareIcon.png"



export default function MadeWith({ Project }) {
    const Icons = [ReactIcon, FirebaseIcon, PythonIcon, NodeJSIcon, Viteicon, MongoIcon, FlaskIcon, ExpressIcon, JavaScriptIcon, VueIcon, ArduinoIcon, CIcon, CppIcon, HardwareIcon]
    const listStack = Project.stack.map( tool =>
        <div className= "projects-stack-component" key= {tool.title}>
            <img className= "projects-stack-icon" src= {Icons[tool.logo]} alt= {tool.title}/>
            <p className= "projects-stack-name">{tool.title}</p>
        </div>           
    )

    return (
        <div className= "projects-stack-display">
            {listStack}
        </div>
    );
  }
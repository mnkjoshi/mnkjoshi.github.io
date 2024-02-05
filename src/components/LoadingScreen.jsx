import * as React from "react";
import { motion } from "framer-motion";

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(255, 255, 255, 0)"
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "rgba(255, 255, 255, 1)"
  }
};


export default function LoadingScreen () {
    

    setTimeout(function() {
        document.getElementById("loading-main").style.opacity = "1"
        document.getElementById("loading-main").style["z-index"] = "3"
    }, 10)

    setTimeout(function() {
        document.getElementById("loading-main").style.opacity = "0"
    }, 1700)

    setTimeout(function() {
        document.getElementById("loading-main").remove
        document.getElementById("loading-main").style["z-index"] = "-1" 
    }, 1700)

    return(
        <div className= "loading-main" id= "loading-main">
            <div className="loading-container">
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="loading-item"
            >
                <motion.path
                    d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
                    variants={icon}
                    initial="hidden"
                    animate="visible"
                    transition={{
                        default: { duration: 1.5, ease: "easeInOut" },
                        fill: { duration: 1.5, ease: [1, 0, 0.8, 1] }
                    }}
                />
            </motion.svg>
        </div>
        </div>
    )
  
};

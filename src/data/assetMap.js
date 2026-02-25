// ── Display images (project hero/screenshots) ──
import LoopCarImg from "../assets/displays/LoopCar.jpg";
import SafetyVisionImg from "../assets/displays/SafetyVision.png";
import WatchDogImg from "../assets/displays/WatchDog.png";
import GamEEImg from "../assets/displays/GamEE.png";
import VitaliSeeImg from "../assets/displays/VitaliSee.png";
import UtiliSeeImg from "../assets/displays/UtiliSee.png";
import CitiWatchImg from "../assets/displays/CitiWatch.png";

// ── Tech logos (indexed by the logo number in projectData) ──
import ReactIcon from "../assets/logos/ReactIcon.png";
import FirebaseIcon from "../assets/logos/FirebaseIcon.png";
import PythonIcon from "../assets/logos/PythonIcon.png";
import NodeJSIcon from "../assets/logos/NodeJSIcon.png";
import ViteIcon from "../assets/logos/ViteIcon.png";
import MongoIcon from "../assets/logos/MongoIcon.png";
import FlaskIcon from "../assets/logos/FlaskIcon.png";
import ExpressIcon from "../assets/logos/ExpressIcon.png";
import JavaScriptIcon from "../assets/logos/JavaScriptIcon.png";
import VueIcon from "../assets/logos/VueIcon.png";
import ArduinoIcon from "../assets/logos/ArduinoIcon.png";
import CIcon from "../assets/logos/CIcon.png";
import CppIcon from "../assets/logos/CppIcon.png";
import HardwareIcon from "../assets/logos/HardwareIcon.png";
import NextJSIcon from "../assets/logos/NextJSIcon.png";

// Logo index → image path  (matches the integer in projectData stack[].logo)
export const LOGO_MAP = {
  0: ReactIcon,
  1: FirebaseIcon,
  2: PythonIcon,
  3: NodeJSIcon,
  4: ViteIcon,
  5: MongoIcon,
  6: FlaskIcon,
  7: ExpressIcon,
  8: JavaScriptIcon,
  9: VueIcon,
  10: ArduinoIcon,
  11: CIcon,
  12: CppIcon,
  13: HardwareIcon,
  14: NextJSIcon,
};

// Project id → display image
export const DISPLAY_MAP = {
  loopcar: LoopCarImg,
  safetyvision: SafetyVisionImg,
  watchdog: WatchDogImg,
  "gamee-lite": GamEEImg,
  vitalisee: VitaliSeeImg,
  utilisee: UtiliSeeImg,
  citiwatch: CitiWatchImg,
};

// Real project data sourced from projectData.js — used as fallback when Firestore is empty.
import { DISPLAY_MAP } from "./assetMap";

export const dummyProjects = [
  {
    id: "safetyvision",
    title: "SafetyVision",
    tagline: "First Place in HackED 2023 — Alberta's Largest Hackathon",
    description:
      "SafetyVision utilizes machine learning algorithms in its web application to analyze data from low-tech cameras, detecting and displaying weapon risks. This technology enhances community safety by providing real-time alerts to local law enforcement personnel through a dashboard interface. Collaboration ensures ethical implementation, privacy protection, and effective utilization of ML for community security.",
    stack: [
      { logo: 0, title: "React" },
      { logo: 1, title: "Firebase" },
      { logo: 2, title: "Python" },
      { logo: 3, title: "NodeJS" },
      { logo: 6, title: "Flask" },
      { logo: 8, title: "JavaScript" },
    ],
    live: null,
    yt: null,
    github: "https://github.com/andyjianzhou/SafetyVision-SlightlyProfessional-",
    image: DISPLAY_MAP["safetyvision"],
    featured: true,
  },
  {
    id: "citiwatch",
    title: "CitiWatch",
    tagline: "First Place in MovEd — Alberta's first Government-run GovTech Hackathon",
    description:
      "CitiWatch is a safety aggregation tool that allows government agencies like the RCMP and EPS to identify and locate threats to public safety such as gun violence, knife violence, violent offenders, and resolve situations like amber alerts and BOLO alerts, quicker, faster, and more safely. CitiWatch can run on a system of cameras as low-end as simple ring doorbell cameras to identify threats to public safety.",
    stack: [
      { logo: 0, title: "React" },
      { logo: 1, title: "Firebase" },
      { logo: 3, title: "NodeJS" },
      { logo: 7, title: "ExpressJS" },
      { logo: 14, title: "NextJS" },
      { logo: 8, title: "JavaScript" },
    ],
    live: "https://citi-watch.web.app",
    yt: "https://www.youtube.com/watch?v=vEiPayFn2cE",
    github: "https://github.com/mnkjoshi/CitiWatch",
    image: DISPLAY_MAP["citiwatch"],
    featured: true,
  },
  {
    id: "loopcar",
    title: "LoopCar",
    tagline: "AlbertaLoop 2024 Mechatronics Showdown — Top 6",
    description:
      "LoopCar embodies the essence of DIY ingenuity, crafted with an Arduino at its heart. This model car seamlessly blends traditional handiwork with modern electronics for a truly unique experience. With soldered connections and Arduino programming, it offers precise control and versatile functionality.",
    stack: [
      { logo: 2, title: "Python" },
      { logo: 10, title: "Arduino" },
      { logo: 11, title: "C" },
      { logo: 12, title: "C++" },
      { logo: 13, title: "Circuitry" },
    ],
    live: null,
    yt: "https://youtu.be/aEbsAJDjvbE",
    github: "https://github.com/mnkjoshi/Mechatronics",
    image: DISPLAY_MAP["loopcar"],
    featured: true,
  },
  {
    id: "watchdog",
    title: "WatchDog",
    tagline: "HackED 2024",
    description:
      "WatchDog is a web application empowering security personnel to track potential threats in public spaces. It integrates facial recognition and machine learning to analyze live camera feeds for suspicious behavior. Real-time alerts enable quick response to threats, while a centralized dashboard offers a comprehensive view of monitored locations.",
    stack: [
      { logo: 0, title: "React" },
      { logo: 1, title: "Firebase" },
      { logo: 2, title: "Python" },
      { logo: 3, title: "NodeJS" },
      { logo: 4, title: "Vite" },
      { logo: 6, title: "Flask" },
      { logo: 8, title: "JavaScript" },
    ],
    live: "https://pro-watchdog.web.app/",
    yt: null,
    github: "https://github.com/mnkjoshi/WatchDog",
    image: DISPLAY_MAP["watchdog"],
    featured: true,
  },
  {
    id: "gamee-lite",
    title: "GamEE Lite",
    tagline: "E2-C2 Winner — Alberta's Largest Hardware Hackathon",
    description:
      "GamEE Lite is the ultimate handheld gaming console designed to democratize gaming. Built on Arduino technology, it offers affordability and accessibility for all. With a user-friendly platform, creators can easily learn to code and craft their own games.",
    stack: [
      { logo: 10, title: "Arduino" },
      { logo: 11, title: "C" },
      { logo: 12, title: "C++" },
      { logo: 13, title: "Circuitry" },
    ],
    live: null,
    yt: null,
    github: "https://github.com/mnkjoshi/GamEE-Lite",
    image: DISPLAY_MAP["gamee-lite"],
    featured: false,
  },
  {
    id: "vitalisee",
    title: "VitaliSee",
    tagline: "Hack the Change 2023",
    description:
      "VitaliSee revolutionizes plant care with its intuitive web application. Seamlessly integrated with machine learning, it empowers users to detect diseases, monitor growth, and optimize water/fertilizer cycles for urban sustainability.",
    stack: [
      { logo: 0, title: "React" },
      { logo: 1, title: "Firebase" },
      { logo: 2, title: "Python" },
      { logo: 3, title: "NodeJS" },
      { logo: 4, title: "Vite" },
      { logo: 6, title: "Flask" },
      { logo: 8, title: "JavaScript" },
    ],
    live: null,
    yt: null,
    github: "https://github.com/mnkjoshi/VitaliSee",
    image: DISPLAY_MAP["vitalisee"],
    featured: false,
  },
  {
    id: "utilisee",
    title: "UtiliSee",
    tagline: "Second Place in Sustainable Cities Challenge 2023",
    description:
      "Monitor your water and electricity utilities in real-time! Get AI-powered feedback to make your home services usage more affordable and sustainable.",
    stack: [
      { logo: 0, title: "React" },
      { logo: 1, title: "Firebase" },
      { logo: 2, title: "Python" },
      { logo: 3, title: "NodeJS" },
      { logo: 4, title: "Vite" },
      { logo: 6, title: "Flask" },
      { logo: 8, title: "JavaScript" },
      { logo: 13, title: "Circuitry" },
    ],
    live: null,
    yt: null,
    github: null,
    image: DISPLAY_MAP["utilisee"],
    featured: false,
  },
];

export const dummyHackathons = [
  {
    id: "hacked-2023",
    name: "HackED 2023",
    date: { toDate: () => new Date("2023-01-28") },
    description:
      "Built SafetyVision — an ML-powered weapon detection system for low-tech cameras. Won first place at Alberta's largest hackathon.",
    placement: "1st Place",
    isWinner: true,
    projectLink: "/project/safetyvision",
  },
  {
    id: "moved-govtech",
    name: "MovEd GovTech Hackathon",
    date: { toDate: () => new Date("2023-11-15") },
    description:
      "Created CitiWatch — a public safety aggregation tool for law enforcement. Won first place at Alberta's first government-run hackathon.",
    placement: "1st Place",
    isWinner: true,
    projectLink: "/project/citiwatch",
  },
  {
    id: "e2c2-2023",
    name: "E2-C2 Hardware Hackathon",
    date: { toDate: () => new Date("2023-03-10") },
    description:
      "Built GamEE Lite — a DIY handheld gaming console on Arduino. Won at Alberta's largest hardware hackathon.",
    placement: "Winner",
    isWinner: true,
    projectLink: "/project/gamee-lite",
  },
  {
    id: "sustainable-cities-2023",
    name: "Sustainable Cities Challenge 2023",
    date: { toDate: () => new Date("2023-09-20") },
    description:
      "Developed UtiliSee — real-time water/electricity monitoring with AI-powered sustainability feedback.",
    placement: "2nd Place",
    isWinner: false,
    projectLink: "/project/utilisee",
  },
  {
    id: "albertaloop-2024",
    name: "AlbertaLoop 2024 Mechatronics Showdown",
    date: { toDate: () => new Date("2024-02-15") },
    description:
      "Built LoopCar — an Arduino-powered model car with autonomous navigation and remote control.",
    placement: "Top 6",
    isWinner: false,
    projectLink: "/project/loopcar",
  },
  {
    id: "hacked-2024",
    name: "HackED 2024",
    date: { toDate: () => new Date("2024-01-27") },
    description:
      "Created WatchDog — a real-time threat detection platform using facial recognition and ML for public space security.",
    placement: "Participant",
    isWinner: false,
    projectLink: "/project/watchdog",
  },
  {
    id: "hack-the-change-2023",
    name: "Hack the Change 2023",
    date: { toDate: () => new Date("2023-10-21") },
    description:
      "Built VitaliSee — a plant care web app using ML to detect diseases and optimize watering cycles.",
    placement: "Participant",
    isWinner: false,
    projectLink: "/project/vitalisee",
  },
];

export const dummyBlogs = [
  {
    id: "reverse-engineering-apk",
    title: "Reverse Engineering an Android APK for Fun",
    date: { toDate: () => new Date("2025-11-02") },
    content: `# Reverse Engineering an Android APK\n\nIn this write-up I walk through decompiling a simple Android app, patching its smali code, and re-signing the APK.\n\n## Tools Used\n- apktool\n- jadx\n- jarsigner\n\n## Step 1: Decompile\n\`\`\`bash\napktool d target.apk -o output/\n\`\`\`\n\nThe manifest revealed an exported activity that accepts deep links...`,
    tags: ["Cybersecurity", "Android", "Reverse Engineering"],
  },
  {
    id: "building-homelab",
    title: "My $200 HomeLab Setup with Raspberry Pis",
    date: { toDate: () => new Date("2025-08-14") },
    content: `# HomeLab on a Budget\n\nRunning self-hosted services doesn't have to break the bank. Here's my cluster of three Raspberry Pi 4s running Docker Swarm.\n\n## Services\n- Pi-hole for DNS\n- Nextcloud for file sync\n- Grafana + Prometheus for monitoring\n\n> "The best way to learn infrastructure is to break your own."`,
    tags: ["DevOps", "Homelab", "Docker"],
  },
  {
    id: "rust-cli-lessons",
    title: "Lessons Learned Building My First Rust CLI",
    date: { toDate: () => new Date("2025-05-20") },
    content: `# First Rust CLI\n\nAfter years of Python and JS, I wanted to try a systems language. Rust's ownership model was a steep curve but the compiler errors are genuinely helpful.\n\n## Key Takeaways\n1. Start with \`clap\` for argument parsing\n2. Use \`anyhow\` for ergonomic error handling\n3. Write integration tests early`,
    tags: ["Rust", "CLI", "Programming"],
  },
];

export const dummyExperiences = [
  {
    id: "exp-mlh",
    role: "MLH Production Engineering Fellow",
    company: "Meta",
    location: "Montréal, Canada",
    startDate: { toDate: () => new Date("2025-06-01") },
    endDate: { toDate: () => new Date("2025-09-30") },
    descriptionPoints: [
      "Developed and deployed scalable full-stack applications, implementing CI/CD pipelines, containerization, and cloud-based services to ensure reliability and maintainability.",
      "Practiced production engineering principles, conducting incident response simulations, improving automation.",
      "Monitored and improved service performance across distributed systems leveraging observability tools and cloud infrastructure, ensuring resilience and scalability using Prometheus, Grafana, and Splunk.",
      "Built full-stack web apps using Flask & JavaScript, delivering production-ready features with direct user impact.",
    ],
    links: [],
  },
  {
    id: "exp-cn",
    role: "Operational Technology Security Intern",
    company: "Canadian National Railway",
    location: "Montréal, Canada",
    startDate: { toDate: () => new Date("2024-05-01") },
    endDate: { toDate: () => new Date("2025-08-31") },
    descriptionPoints: [
      "Automated system for CyberSecurity events using Python, reducing response time to incidents by 81%.",
      "Created an internal brake testing prototype running on a Python Back-End to reduce train air brake testing overhead by 62%.",
      "Coded Python scripts to aggregate reports for SWIFT financial system, saving 312 person-hours annually.",
    ],
    links: [],
  },
  {
    id: "exp-jam",
    role: "Full Stack Developer Intern",
    company: "Jam",
    location: "Edmonton, Canada",
    startDate: { toDate: () => new Date("2023-12-01") },
    endDate: { toDate: () => new Date("2024-02-28") },
    descriptionPoints: [
      "Developed REST API for back-end using Express.js, JavaScript, and TypeScript, user data with MongoDB.",
      "Developed front-end web application using Next.js, JavaScript, TypeScript, Tailwind CSS, and HTML.",
    ],
    links: [],
  },
  {
    id: "exp-gamefam",
    role: "Software Developer",
    company: "Gamefam",
    location: "Edmonton, Canada",
    startDate: { toDate: () => new Date("2023-03-01") },
    endDate: { toDate: () => new Date("2023-09-30") },
    descriptionPoints: [
      "Developed game mechanics for multi-platform games using Lua, generating 21.2 million unique game plays.",
      "Reduced game memory usage by 36% using Lua, leading to 17% increased player retention.",
    ],
    links: [],
  },
];

export const dummyLeadership = [
  {
    id: "lead-eec",
    role: "Vice President",
    company: "Electrical Engineering Club",
    location: "Edmonton, Canada",
    startDate: { toDate: () => new Date("2023-04-01") },
    endDate: null,
    descriptionPoints: [
      "Raised upwards of $20,000 in sponsorships for Alberta's largest Collegiate Hardware Hackathon, E2-C2.",
      "Organized collaborative events with 15 companies across Canada to develop student work readiness for industry.",
    ],
    links: [],
  },
];

export const resumeData = {
  name: "Manav Joshi",
  phone: "780-224-7327",
  email: "mnjoshi@ualberta.ca",
  linkedin: "linkedin.com/in/mnkjoshi/",
  github: "github.com/mnkjoshi",
  website: "mnkjoshi.web.app",
  education: {
    school: "University of Alberta",
    degree: "BSc in Electrical Engineering",
    graduation: "Expected December 2026",
    coursework: [
      "TCP/IP Networking",
      "Machine Learning",
      "Multimedia Signal Processing",
      "Linux Fundamentals",
    ],
  },
  skills: {
    languages: ["Python", "Java", "C", "C++", "SQL", "JavaScript", "HTML", "CSS", "MATLAB", "VHDL", "ARM Assembly"],
    frameworks: ["scikit-learn", "PySpark", "Pandas", "NumPy", "PyTorch", "Keras", "TensorFlow", "React", "Express.js", "Vue.js"],
    tools: ["Git", "Docker", "Firebase", "MongoDB", "Node.js", "Power BI"],
    apis: ["OpenAI", "ChatGPT", "Twilio", "X", "Generative AI", "Apple Maps", "Google Maps"],
  },
};

export interface Project {
  id: string;
  title: string;
  category: "ai" | "web" | "all";
  tagline: string;
  summary: string;
  metrics: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  challenges: string;
  solutions: string;
  highlights: string[];
  roadmap: string[];
  videoUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; info?: string }[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
}

// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION INTERFACE
// To add a certificate image, simply add an imageUrl field pointing
// to an image in /assets/certs/ or any URL. Example:
//   { name: "My Cert", issuer: "Google", imageUrl: "/assets/certs/my-cert.png" }
// ═══════════════════════════════════════════════════════════════════
export interface Certification {
  name: string;
  issuer: string;
  link?: string;
  imageUrl?: string;
  date?: string;
}

export const PERSONAL_INFO = {
  name: "Ronak Prajapati",
  title: "AI Engineer & Full Stack Developer",
  subtitles: [
    "Machine Learning Researcher",
    "AI Product Architect",
    "Full Stack Software Engineer"
  ],
  location: "Kadi, Mehsana, Gujarat, India",
  email: "ronakhos6666@gmail.com",
  phone: "+91 9426723541",
  whatsapp: "+91 8780192795",
  graduation: "Expected 2027",
  cgpa: "8.4 (Highest: 9.00)",
  university: "Indrashil University",
  github: "https://github.com/Ronak-webdev",
  linkedin: "https://www.linkedin.com/in/ronak-prajapati-42776b369/",
  huggingface: "https://huggingface.co/ronaksp",
  medium: "https://medium.com/@shaileshkumarprajapati11200",
  leetcode: "ronak_prajapati",
  resumeDrive: "https://drive.google.com/file/d/1k0y5Qc4Og5tGe9NKKiA5MDL3kF4zfTp-/view?usp=sharing",
  aboutMe: `I build scalable full-stack software that transforms advanced AI research into practical, real-world products. My programming journey started in my first year of college with C++, which built a solid foundation of memory management and logical problem-solving. Over time, my curiosity led me to master full-stack web engineering, deep learning, computer vision, and local-first generative AI frameworks. I believe Artificial Intelligence should be private, efficient, and accessible rather than locked behind expensive cloud APIs. Outside of writing code and designing AI models, I find creative inspiration in playing the Piano, playing the Harmonium, and singing.`,
};

// ═══════════════════════════════════════════════════════════════════
// PROJECTS — Easy Content Management
// To add a new project, copy any object below and modify the fields.
// videoUrl is optional — used for the hover preview in project cards.
// ═══════════════════════════════════════════════════════════════════
export const PROJECTS: Project[] = [
  {
    id: "oneworld",
    title: "One World (AI Media Studio)",
    category: "ai",
    tagline: "Local-First GPU-Accelerated AI Media Suite",
    summary: "A privacy-first AI platform built to deliver advanced image, audio, and media processing directly on the user's hardware. By leveraging local NVIDIA GPU acceleration via PyTorch and ONNX Runtime, it removes dependency on expensive cloud APIs, ensuring absolute privacy.",
    metrics: [
      "Image denoising speedups: 4.3s down to 0.27s",
      "CPU utilization optimized from 100% to 20%",
      "Smooth 60 FPS interactive WebGL dashboard"
    ],
    technologies: ["Next.js", "FastAPI", "PyTorch", "ONNX Runtime", "Three.js", "Faster Whisper", "Demucs", "SQLite", "Real-ESRGAN", "GFPGAN"],
    githubUrl: "https://github.com/Ronak-webdev/One-World",
    liveUrl: "https://one-world-nu.vercel.app/",
    challenges: "Thread explosion and massive RAM utilization during concurrent model loads caused local machines to hang and bottleneck when executing Demucs or Whisper models.",
    solutions: "Developed a centralized lazy-loading Model Manager that caches models in VRAM, restricting thread pools and routing heavy background tasks through an asynchronous SQLite job queue.",
    highlights: [
      "AI Audio: Vocal separation, instrumental extraction, and speech transcription",
      "AI Image: Background removal, upscaling, face restoration, and sharpening",
      "Modular design for seamless future local LLM & Video upscaling extensions"
    ],
    roadmap: ["AI Video Enhancement & Frame Interpolation", "Local LLM Integration (via Ollama)", "Text-to-Image / Video Generative modules"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41732-large.mp4"
  },
  {
    id: "fillflow",
    title: "FillFlow (AI Social Music Platform)",
    category: "ai",
    tagline: "AI-Powered Singing Coach & Collaborative Streamer",
    summary: "A unified AI social music ecosystem combining streaming, real-time sync listening, karaoke recording, lyric synchronization, and digital vocal analysis under one elegant platform.",
    metrics: [
      "Real-time pitch tracking latency: <15ms",
      "High-fidelity vocal extraction in seconds",
      "Zero-overhead shared listening state synchronization"
    ],
    technologies: ["React", "FastAPI", "Node.js", "Express", "MongoDB", "Socket.IO", "Librosa", "FFmpeg", "Demucs", "Gemini API"],
    githubUrl: "https://github.com/Ronak-webdev/fillflow",
    liveUrl: "https://fillflow-three.vercel.app/",
    challenges: "Bypassing YouTube CORS streaming limits and dealing with high audio sync latencies across different browsers while performing live karaoke recordings.",
    solutions: "Designed a hybrid proxy system for streaming assets and coupled Web Audio API analyzers with optimized caching for separated backing and vocal stems.",
    highlights: [
      "Interactive Karaoke Studio with live, automated voice/instrument separation",
      "AI Vocal Coach: Evaluates pitch accuracy, rhythm consistency, and stability",
      "Dynamic real-time shared listening sessions powered by WebSockets"
    ],
    roadmap: ["WebRTC-based Live Duet recording", "Adaptive recommendation engine", "Multi-language lyrics alignment"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sound-wave-of-a-laser-light-in-equalizer-format-41855-large.mp4"
  },
  {
    id: "gujaratiocr",
    title: "Gujarati Digit Recognition",
    category: "ai",
    tagline: "CNN Handwriting OCR for Regional Scripts",
    summary: "An interactive, browser-based drawing canvas that recognizes handwritten Gujarati numerals using custom Convolutional Neural Networks (CNN) and advanced computer vision preprocessing pipelines.",
    metrics: [
      "Digit classification accuracy: 98.4%",
      "Interactive draw-to-inference pipeline: <10ms latency",
      "Clean confidence distribution scores"
    ],
    technologies: ["Python", "Flask", "TensorFlow", "Keras", "OpenCV", "HTML5 Canvas", "Docker"],
    liveUrl: "https://huggingface.co/spaces/ronaksp/Gujarati-Digit-Recognizer",
    challenges: "Extreme variability in strokes, thickness, and noise in handwritten regional scripts compared to standard English MNIST datasets.",
    solutions: "Engineered an OpenCV preprocessing pipeline that handles adaptive thresholding, morphological dilation, contour detection, padding, and standardized 28x28 normalizations.",
    highlights: [
      "Interactive drawing canvas with dynamic stroke sizing and real-time capture",
      "Multi-digit segmentation using OpenCV contour bounding boxes",
      "Hosted seamlessly inside Dockerized container pipelines"
    ],
    roadmap: ["Word-level and full Gujarati sentence handwriting OCR", "Transformer-based Vision OCR models", "Mobile-friendly camera OCR integration"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-lines-of-code-on-a-computer-screen-32743-large.mp4"
  },
  {
    id: "aresseg",
    title: "Drone Image Segmentation (ARES-Seg)",
    category: "ai",
    tagline: "YOLOv8-Based Remote Sensing Platform",
    summary: "An advanced remote sensing and aerial inspection solution applying instance segmentation on high-resolution drone imagery to detect buildings, roads, vegetation, and solar panel arrays.",
    metrics: [
      "mAP@50: 0.47 for dense classes",
      "Inference speed: 19.8ms (~50 FPS on RTX 3070 Ti)",
      "Pixel-level precise area mapping calculations"
    ],
    technologies: ["PyTorch", "YOLOv8-Seg", "OpenCV", "Flask", "Docker", "Hugging Face"],
    liveUrl: "https://huggingface.co/spaces/ronaksp/Drone-Segmentation",
    challenges: "Altitude changes, small target footprints, and heavy overlap of structures led traditional bounding box models to obscure detailed geographical boundaries.",
    solutions: "Utilized YOLOv8 anchor-free instance segmentation with custom mixed-precision (AMP) inference and mosaic data augmentations.",
    highlights: [
      "High-resolution drone image segmentation with pixel-level precision overlays",
      "Automated surface area estimation for city planning and damage appraisal",
      "Optimized Edge AI inference pipeline suitable for on-board companion computer systems"
    ],
    roadmap: ["TensorRT acceleration integration", "Multi-spectral / Thermal camera support", "3D point cloud generation from segmented 2D streams"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-modern-busy-city-at-night-42171-large.mp4"
  },
  {
    id: "multiai",
    title: "Multi AI Computer Vision Suite",
    category: "ai",
    tagline: "Centralized Plant Disease Classification & Object Detection",
    summary: "A unified portal demonstrating the co-existence of multiple deep learning model backends, currently hosting Plant Health Disease Identification and Real-time Pigeon Detection.",
    metrics: [
      "Plant Disease Classification Top-1 accuracy: 99.85%",
      "Pigeon Detection mAP@0.5: 95.8%",
      "Ultra-low latency model hot-swapping"
    ],
    technologies: ["PyTorch", "YOLOv8", "EfficientNet", "OpenCV", "Gradio", "Hugging Face"],
    liveUrl: "https://huggingface.co/spaces/ronaksp/Multi-AI",
    challenges: "Serving distinct models (classification vs object detection) simultaneously caused heavy GPU VRAM thrashing and dependency conflicts during container builds.",
    solutions: "Designed a lightweight model-switching class in PyTorch that lazy-loads weights as needed and utilizes standard shared preprocessing functions.",
    highlights: [
      "EfficientNet-powered botanical pathogen diagnostic assistant",
      "YOLOv8-powered real-time object detection for urban bird tracking",
      "Elegant centralized playground UI with side-by-side diagnostic logs"
    ],
    roadmap: ["Integrating real-time video stream diagnostics", "TensorRT model quantization", "Automated custom dataset upload and retraining loop"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-digital-particle-flow-41983-large.mp4"
  },
  {
    id: "smartmart",
    title: "SmartMart",
    category: "web",
    tagline: "Type-Safe Full-Stack Grocery Delivery Platform",
    summary: "A modern, highly optimized relational e-commerce platform built to streamline grocery shopping, inventory control, and admin logistics with bulletproof database modeling.",
    metrics: [
      "Response times for heavy category lookups: <30ms",
      "100% type-safety across client, API, and database",
      "Optimized relational schemas preventing orphan states"
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma ORM", "Tailwind CSS", "Cloudflare", "Neon"],
    githubUrl: "https://github.com/Ronak-webdev/fillflow", // Part of his webdev repos
    challenges: "Maintaining database consistency across complex multi-item cart purchases, concurrent checkouts, and updating real-time inventory levels without race conditions.",
    solutions: "Modeled relational models with PostgreSQL on Prisma ORM using isolation levels, transaction batch blocks, and rigorous type verification.",
    highlights: [
      "Type-safe API routes ensuring seamless client-server communication",
      "Comprehensive dashboards for admins to oversee inventory levels and dispatch drivers",
      "Vibrant responsive design built with highly clean component abstractions"
    ],
    roadmap: ["Stripe / Razorpay payment gateway integration", "Redis caching layer for trending products", "Live delivery location tracking with socket links"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-moving-through-supermarket-aisle-41882-large.mp4"
  },
  {
    id: "plantcare",
    title: "Plant Care AI Assistant",
    category: "web",
    tagline: "Generative Agricultural Care Companion",
    summary: "An AI assistant providing farmers and home gardeners with instant natural-language diagnostic advice, plant disease treatment steps, and agricultural management routines.",
    metrics: [
      "User advice retrieval time: <1.2s",
      "Accurate prompt alignment for 50+ plant species",
      "95% helpfulness ratings from active community testers"
    ],
    technologies: ["React", "Prompt Engineering", "NLP", "Google Gemini API", "Tailwind CSS", "Netlify"],
    liveUrl: "https://happyplant.netlify.app/",
    challenges: "Formatting raw, unpredictable model outputs into a structured, easily readable treatment script with actionable steps for gardeners.",
    solutions: "Created a structured prompt engineering system utilizing specialized system parameters and responsive UI parsing for hierarchical lists.",
    highlights: [
      "Intelligent chatbot with contextual awareness regarding regional planting climates",
      "Comprehensive care database ranging from watering schedules to organic pesticide recipes",
      "Clean minimalist layout optimized for readability and fast interactions"
    ],
    roadmap: ["Direct photo diagnostics using Gemini Vision models", "Integrated local hyper-local weather tracking alerts", "Soil moisture sensor telemetry monitoring dashboard"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-green-plants-swaying-gently-in-the-wind-41908-large.mp4"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Artificial Intelligence & ML",
    skills: [
      { name: "Deep Learning", level: 90, info: "PyTorch, TensorFlow, Keras" },
      { name: "Computer Vision", level: 88, info: "OpenCV, YOLOv8, Instance Segmentation" },
      { name: "Optical Character Recognition (OCR)", level: 85, info: "Tesseract, Contour Analysis, CNN OCR" },
      { name: "Audio AI / DSP", level: 82, info: "Demucs Vocal Separation, Faster Whisper Speech-to-text" },
      { name: "Generative AI & LLMs", level: 88, info: "Gemini API, RAG, Prompt Engineering, LangChain" },
      { name: "Model Quantization & Deployment", level: 80, info: "ONNX Runtime, Hugging Face Spaces, FP16 inference" }
    ]
  },
  {
    title: "Full-Stack Web Engineering",
    skills: [
      { name: "React.js & Next.js", level: 92, info: "TypeScript, Zustand, Server Actions, Client SPA" },
      { name: "Node.js & Express.js", level: 88, info: "Async pipelines, modular routing, clean architectures" },
      { name: "FastAPI", level: 85, info: "High-performance Python AI microservices, Pydantic, AsyncIO" },
      { name: "PostgreSQL & MongoDB", level: 86, info: "Relational Prisma schemas, transactional query optimizations" },
      { name: "WebSockets / Socket.IO", level: 84, info: "Real-time state synchronization, live chat integrations" },
      { name: "Tailwind CSS & Animations", level: 95, info: "GSAP, Framer Motion, CSS 3D transforms, fluid systems" }
    ]
  },
  {
    title: "DevOps & Core Engineering",
    skills: [
      { name: "C++ Programming", level: 85, info: "Data structures, memory management, algorithms" },
      { name: "Python Engineering", level: 90, info: "Advanced asyncio, thread pools, AI prototyping" },
      { name: "Docker & Containerization", level: 80, info: "Multi-stage builds, isolated local services" },
      { name: "Git & CI/CD Pipelines", level: 86, info: "GitHub Actions, semantic versioning, branch control" },
      { name: "Cloud Architecture", level: 78, info: "GCP, AWS, Azure, Cloudflare deployment tunnels" }
    ]
  }
];

export const TIMELINE = [
  {
    year: "First Year (2023 - 2024)",
    title: "Foundation & Problem Solving",
    details: "Began B.Tech in CSE at Indrashil University. Started coding in C++ to master fundamental data structures, search algorithms, and algorithmic reasoning. Built early web templates and client-server setups."
  },
  {
    year: "Second Year (2024)",
    title: "Entering Full Stack Engineering",
    details: "Learned MERN stack (MongoDB, Express, React, Node.js). Engineered scalable API servers, state management stores, and secure session management. Deployed projects on Vercel and Render."
  },
  {
    year: "Third Year (2024 - 2025)",
    title: "Pivoting to Advanced AI & CV",
    details: "Dived deep into Machine Learning, Computer Vision, and Audio AI. Built model servers using FastAPI and PyTorch. Mastered OpenCV, CNN character recognitions, YOLO segmentation, and speech processing."
  },
  {
    year: "Fourth Year (Current)",
    title: "Building Production-Grade AI Systems",
    details: "Focusing on local AI execution, Edge systems, and autonomous agentic workflows. Founded 'One World' to consolidate offline media processing. Active in Hackathons (AutonomousHacks '26) and student leadership."
  }
];

export const EXPERIENCES: Experience[] = [
  {
    role: "AI & Machine Learning Researcher & Engineer",
    company: "Self-Driven Research & Open Source",
    period: "Jan 2025 - Present",
    description: [
      "Designed and deployed GPU-accelerated deep learning pipelines using FastAPI, ONNX, and PyTorch.",
      "Engineered high-accuracy instance segmentation (YOLOv8-Seg) and character recognitions systems (CNN OCR).",
      "Created RAG architectures and multi-modal generative agents using Gemini, achieving privacy-first security.",
      "Optimized memory and speed benchmarks (FP16/quantizations), reducing idle CPU bottlenecks significantly."
    ],
    technologies: ["Python", "FastAPI", "PyTorch", "OpenCV", "TensorFlow", "Hugging Face", "ONNX", "Docker"]
  },
  {
    role: "Full Stack Developer",
    company: "Engineering Laboratories & Personal Apps",
    period: "2024 - Present",
    description: [
      "Built highly interactive React and Next.js SPAs with custom state management and seamless Tailwind styling.",
      "Architected secure, protected backend servers handling large media uploads and concurrent user sessions.",
      "Integrated real-time streaming sockets and optimized transactional databases with type-safe schemas."
    ],
    technologies: ["React", "Next.js", "Node.js", "Express", "TypeScript", "PostgreSQL", "Prisma", "Socket.IO"]
  },
  {
    role: "Founder & Lead Developer",
    company: "One World (AI Media Studio)",
    period: "2025 - Present",
    description: [
      "Conceptualized, designed, and deployed the One World local-first AI platform for creator accessibility.",
      "Authored custom asynchronous python pipelines, caching models to optimize system memory footprint.",
      "Constructed a high-fidelity WebGL user dashboard with smooth 3D transformations."
    ],
    technologies: ["FastAPI", "Next.js", "Three.js", "PyTorch", "Faster Whisper", "Demucs", "SQLite"]
  }
];

// ═══════════════════════════════════════════════════════════════════
// CERTIFICATIONS — Easy Content Management
// To add a new certificate:
//   1. Add a new object to this array
//   2. Optionally add an image: imageUrl: "/assets/certs/filename.png"
//   3. Optionally add a date: date: "2025"
//   4. Optionally add a link: link: "https://..."
// ═══════════════════════════════════════════════════════════════════
export const CERTIFICATIONS: Certification[] = [
  // ════════════ Certificates (Priority) ════════════
  { name: "MongoDB Node.js Developer Path", issuer: "MongoDB University", date: "2024", imageUrl: "/certifications/mongodb_bootcamp.jpg" },
  { name: "CRUD Operations in MongoDB", issuer: "MongoDB University", date: "2024", imageUrl: "/certifications/mongodb_crud.jpg" },
  { name: "Deep Learning Onramp", issuer: "MathWorks", date: "2024", imageUrl: "/certifications/dl_onramp.jpg" },
  { name: "Machine Learning Onramp", issuer: "MathWorks", date: "2024", imageUrl: "/certifications/ml_onramp.jpg" },
  { name: "MATLAB Onramp", issuer: "MathWorks", date: "2024", imageUrl: "/certifications/matlab_onramp.jpg" },
  { name: "Tailwind CSS Bootcamp", issuer: "Udemy Certified", date: "2024", imageUrl: "/certifications/tailwind_bootcamp.jpg" },

  
  // ════════════ Badges (Secondary) ════════════
  { name: "Develop GenAI Apps with Gemini & Streamlit", issuer: "Google Cloud Skills Boost", date: "2025", imageUrl: "/certifications/gemini_streamlit.jpg" },
  { name: "Prompt Design in Vertex AI", issuer: "Google Cloud Skills Boost", date: "2025", imageUrl: "/certifications/gemini_prompt_design.jpg" },
  { name: "Explore Generative AI with Gemini API", issuer: "Google Cloud Skills Boost", date: "2025", imageUrl: "/certifications/gemini_vertex.jpg" },
  { name: "Inspect Rich Documents & Multimodal RAG", issuer: "Google Cloud Skills Boost", date: "2025", imageUrl: "/certifications/gemini_inspect_multimodal.jpg" },
  { name: "Build Real-World AI Apps with Gemini & Imagen", issuer: "Google Cloud Skills Boost", date: "2025", imageUrl: "/certifications/gemini_imagen.jpg" },
  { name: "Python Essentials 1", issuer: "Cisco Networking Academy", date: "2024", imageUrl: "/certifications/python_essential_1.png" },
  { name: "Python Essentials 2", issuer: "Cisco Networking Academy", date: "2024", imageUrl: "/certifications/python_essential_2.jpg" },
  { name: "Autonomous Hackathon", issuer: "Hackathon 2026", date: "2026", imageUrl: "/certifications/AutonomusHack26_Certificate.jpeg" }
];

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import profileImg from './assets/profile.png';
import {
  Palette,
  Video,
  Layers,
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  Brush,
  Film,
  Bot,
  X,
  Shirt,
  FileDown,
  Download
} from 'lucide-react';

const ROBOT_GLTF_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

// Preload the GLTF robot model
useGLTF.preload(ROBOT_GLTF_URL);

// Fallback HTML Loader inside Three.js Canvas
function RobotLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md shadow-2xl min-w-[200px] text-center">
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Bot className="w-5 h-5 text-cyan-400 absolute animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
          Loading 3D Robot...
        </span>
        <span className="text-[10px] text-cyan-400 mt-1 font-medium">
          Interactive Expressive GLTF
        </span>
      </div>
    </Html>
  );
}

// Animated Robot Expressive GLTF Model
function RobotModel() {
  const group = useRef();
  const { scene, animations } = useGLTF(ROBOT_GLTF_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;

    const walkingAction = actions['Walking'] || actions['Idle'];
    const waveAction = actions['Wave'];

    if (!walkingAction) return;

    // Start with friendly welcoming Wave gesture
    if (waveAction) {
      waveAction.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.4).play();

      // Transition smoothly to continuous Walking loop after wave
      const initialTimer = setTimeout(() => {
        waveAction.fadeOut(0.4);
        if (walkingAction) {
          walkingAction.reset().fadeIn(0.4).play();
        }
      }, 3000);

      // Trigger the Wave animation periodically every 10 seconds
      const waveInterval = setInterval(() => {
        if (waveAction && walkingAction) {
          walkingAction.fadeOut(0.4);
          waveAction.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.4).play();

          setTimeout(() => {
            waveAction.fadeOut(0.4);
            walkingAction.reset().fadeIn(0.4).play();
          }, 3200);
        }
      }, 10000);

      return () => {
        clearTimeout(initialTimer);
        clearInterval(waveInterval);
        Object.values(actions).forEach((a) => a?.stop());
      };
    } else {
      walkingAction.reset().fadeIn(0.5).play();
      return () => {
        walkingAction.stop();
      };
    }
  }, [actions]);

  // Click on robot to trigger an immediate greeting wave
  const handlePointerDown = (e) => {
    e.stopPropagation();
    const waveAction = actions['Wave'];
    const walkingAction = actions['Walking'] || actions['Idle'];
    if (waveAction && walkingAction) {
      walkingAction.fadeOut(0.3);
      waveAction.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.3).play();
      setTimeout(() => {
        waveAction.fadeOut(0.3);
        walkingAction.reset().fadeIn(0.3).play();
      }, 3000);
    }
  };

  return (
    <group ref={group} onPointerDown={handlePointerDown}>
      <primitive
        object={scene}
        scale={0.56}
        position={[0, -1.6, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

// Error Boundary for Three.js
class RobotErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('3D Robot Scene error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Curated Photoshop Apparel & Custom T-Shirt Collection Data
const tshirtCollection = [
  {
    id: 1,
    title: "Nutty Squad — Full Sublimation Character Apparel",
    badge: "All-Over Print Sublimation • Mascot Art",
    frontImg: "/assets/tshirts/tshirt-front.png",
    backImg: "/assets/tshirts/tshirt-back.png",
    overview: "High-contrast dynamic mascot sublimation jersey engineered in Adobe Photoshop for Nutty Squad, featuring seamless 360-degree panel wrapping at 300 DPI.",
    highlights: [
      "Front: Multi-character mascot ensemble with custom lighting and stroke separation.",
      "Back: Dynamic logo banner with character storytelling and URL callout.",
      "Technical: Full-cut dye sublimation pattern precision."
    ]
  },
  {
    id: 2,
    title: "KS Creations — Half-Tone Gradient Polka Polo",
    badge: "Custom Polo Sublimation • Halftone Typography",
    frontImg: "/assets/tshirts/polo-dot-front.png",
    backImg: "/assets/tshirts/polo-dot-back.png",
    overview: "A sophisticated corporate-sportswear polo shirt design blending a deep midnight navy with a dusty rose gradient halftone polka pattern and bespoke embroidery-style branding.",
    highlights: [
      "Front: Precision dot matrix gradient with clean contrast collar and placket detailing.",
      "Back: Minimalist KS CREATIONS bold typographical brand prominence.",
      "Technical: Engineered vector halftone dot matrix scaled for high-definition apparel print."
    ]
  },
  {
    id: 3,
    title: "KS Creations — Cyber Geometric Cyber-Grid Polo",
    badge: "Sublimation Sportswear • Geometric Art",
    frontImg: "/assets/tshirts/polo-geo-front.png",
    backImg: "/assets/tshirts/polo-geo-back.png",
    overview: "An energetic modern athletic polo shirt utilizing electric cyan and cobalt blue geometric square maze patterns, contrasting trims, and contemporary typography.",
    highlights: [
      "Front: Layered concentric square patterns creating optical depth and motion.",
      "Back: Crisp typography placement ensuring brand visibility across the shoulders.",
      "Technical: Balanced color-split collar and cuffs with seamless continuous pattern flow."
    ]
  }
];

// Reusable Section Component for Full-Screen Vertical Scrolling T-Shirt Showcase
function TshirtProjectSection({ design, index, total, onVisible }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mountTimer;
    if (index === 0) {
      mountTimer = setTimeout(() => {
        setIsVisible(true);
        onVisible?.(0);
      }, 100);
    }

    const currentElem = sectionRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.(index);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(currentElem);

    return () => {
      if (mountTimer) clearTimeout(mountTimer);
      observer.disconnect();
    };
  }, [index, onVisible]);

  // Dynamic styling and fallbacks per design theme
  const designNum = design.number || String(design.id || index + 1).padStart(2, '0');
  const frontImage = design.frontImg || design.frontImage;
  const backImage = design.backImg || design.backImage;
  
  const badgeColor = design.badgeColor || (
    index === 0 ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
    index === 1 ? "bg-rose-500/10 text-rose-300 border-rose-500/30" :
    "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
  );

  const glowColor = design.glowColor || (
    index === 0 ? "from-amber-500/30 via-orange-500/20 to-transparent" :
    index === 1 ? "from-rose-500/30 via-purple-500/20 to-transparent" :
    "from-cyan-500/30 via-blue-500/20 to-transparent"
  );

  const dropShadow = design.dropShadow || (
    index === 0 ? "drop-shadow-[0_25px_60px_rgba(251,146,60,0.35)]" :
    index === 1 ? "drop-shadow-[0_25px_60px_rgba(244,63,94,0.35)]" :
    "drop-shadow-[0_25px_60px_rgba(6,182,212,0.35)]"
  );

  const frontLabel = design.frontLabel || (
    index === 0 ? "Front Panel • Mascot Squad Layout" :
    index === 1 ? "Front Panel • Halftone Dot Matrix" :
    "Front Panel • Cyber Geometric Grid"
  );

  const backLabel = design.backLabel || (
    index === 0 ? "Back Panel • Storytelling & Branding" :
    index === 1 ? "Back Panel • Typographical Brand Prominence" :
    "Back Panel • Bold Shoulder Brand Presence"
  );

  const tags = design.tags || [
    "Adobe Photoshop",
    design.badge?.split('•')?.[0]?.trim() || "Sublimation",
    "Commercial Merch",
    "300 DPI Print-Ready"
  ];

  return (
    <section
      ref={sectionRef}
      id={`tshirt-design-${index + 1}`}
      className="min-h-screen py-16 flex flex-col justify-center items-center border-b border-slate-800/60 relative w-full overflow-hidden px-4 sm:px-6 md:px-12"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header & Subtitle */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm">
                DESIGN {designNum} OF 0{total}
              </span>
              <span className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${badgeColor}`}>
                {design.badge}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F8FAFC] tracking-tight">
              {design.title}
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">PRINT READY</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">300 DPI</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">SUBLIMATION</span>
          </div>
        </div>

        {/* Mockups Container: Slide in from Left (Front) & Right (Back) to meet in center */}
        <div className="w-full relative py-6 md:py-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 overflow-hidden">
          {/* FRONT MOCKUP - Slides in from LEFT */}
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out transform bg-transparent border-none shadow-none ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative group bg-transparent border-none shadow-none">
              <div className={`absolute inset-0 bg-gradient-to-t ${glowColor} blur-3xl rounded-full pointer-events-none group-hover:scale-110 transition-all duration-500`} />
              <img
                src={frontImage}
                alt={`${design.title} Front Elevation`}
                className={`relative max-h-[360px] sm:max-h-[420px] md:max-h-[480px] lg:max-h-[520px] w-auto object-contain ${dropShadow} transition-transform duration-500 group-hover:scale-105`}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 shadow-md text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {frontLabel}
            </div>
          </div>

          {/* BACK MOCKUP - Slides in from RIGHT */}
          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out transform bg-transparent border-none shadow-none ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative group bg-transparent border-none shadow-none">
              <div className={`absolute inset-0 bg-gradient-to-t ${glowColor} blur-3xl rounded-full pointer-events-none group-hover:scale-110 transition-all duration-500`} />
              <img
                src={backImage}
                alt={`${design.title} Back Elevation`}
                className={`relative max-h-[360px] sm:max-h-[420px] md:max-h-[480px] lg:max-h-[520px] w-auto object-contain ${dropShadow} transition-transform duration-500 group-hover:scale-105`}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 shadow-md text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              {backLabel}
            </div>
          </div>
        </div>

        {/* Sequential Description & Highlights Fade-in directly beneath mockups - Compact & Minimal */}
        <div
          className={`w-full max-w-3xl mt-6 transition-all duration-700 ease-out delay-500 transform ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-4 md:p-6 shadow-xl">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              {tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold bg-slate-950/80 text-amber-300 border border-amber-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Design Title & Overview */}
            <h4 className="text-lg md:text-xl font-bold text-[#F8FAFC] tracking-tight mb-2.5">
              {design.title}
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-5">
              {design.overview}
            </p>

            {/* Highlights Grid - Sleek Single-Row Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              {design.highlights?.map((h, hIdx) => {
                const isString = typeof h === 'string';
                const parts = isString ? h.split(/:\s*(.+)/) : [];
                const title = isString ? (parts[0] || 'Highlight') : h.title;
                const desc = isString ? (parts[1] || h) : h.desc;
                const HIcon = !isString && h.icon ? h.icon : (hIdx === 0 ? Sparkles : hIdx === 1 ? CheckCircle2 : Brush);
                const itemBadgeColor = !isString && h.badgeColor
                  ? h.badgeColor
                  : (hIdx === 0 ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : hIdx === 1 ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-purple-500/20 border-purple-500/30 text-purple-400');

                return (
                  <div
                    key={hIdx}
                    className="rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 p-3 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${itemBadgeColor}`}>
                        <HIcon className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-200">
                        {title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [robotMousePos, setRobotMousePos] = useState({ x: 0, y: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isTshirtGalleryOpen, setIsTshirtGalleryOpen] = useState(false);
  const [isPixelEyeModalOpen, setIsPixelEyeModalOpen] = useState(false);
  const [isAidsModalOpen, setIsAidsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isSliotModalOpen, setIsSliotModalOpen] = useState(false);
  const [isFiverrModalOpen, setIsFiverrModalOpen] = useState(false);
  const [isMediloopModalOpen, setIsMediloopModalOpen] = useState(false);
  const [isCertZoomed, setIsCertZoomed] = useState(false);
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const robotContainerRef = useRef(null);

  // Esc key listener and body scroll lock for modals (profile, cv, t-shirt gallery, pixel eye, aids poster, certs, sliot, fiverr, & mediloop)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsCvOpen(false);
        setIsTshirtGalleryOpen(false);
        setIsPixelEyeModalOpen(false);
        setIsAidsModalOpen(false);
        setIsCertModalOpen(false);
        setIsCertZoomed(false);
        setIsSliotModalOpen(false);
        setIsFiverrModalOpen(false);
        setIsMediloopModalOpen(false);
      }
    };
    if (isProfileOpen || isCvOpen || isTshirtGalleryOpen || isPixelEyeModalOpen || isAidsModalOpen || isCertModalOpen || isSliotModalOpen || isFiverrModalOpen || isMediloopModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isProfileOpen, isCvOpen, isTshirtGalleryOpen, isPixelEyeModalOpen, isAidsModalOpen, isCertModalOpen, isSliotModalOpen, isFiverrModalOpen, isMediloopModalOpen]);

  const scrollToAnchor = (elementId) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRobotMouseMove = (e) => {
    if (!robotContainerRef.current) return;
    const rect = robotContainerRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setRobotMousePos({ x: normX, y: normY });
  };

  const handleRobotMouseLeave = () => {
    setRobotMousePos({ x: 0, y: 0 });
  };


  const creativePillars = [
    {
      title: "Graphic Design",
      tool: "Adobe Photoshop & Illustrator",
      icon: Palette,
      targetId: "graphic-design-projects",
      accentColor: "from-blue-600/20 via-cyan-500/10 to-transparent",
      borderColor: "border-blue-500/30 hover:border-blue-400/60",
      glowColor: "rgba(59, 130, 246, 0.25)",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
      description: "Photoshop mastery focusing on high-impact visual identity, digital photo manipulation, cyber aesthetic posters, and bespoke brand collateral.",
      highlights: ["Brand Identity & Guidelines", "Digital Art & Photo Retouching", "Social Media Key Visuals"]
    },
    {
      title: "Video Editing & Motion",
      tool: "CapCut & Motion Storytelling",
      icon: Video,
      targetId: "video-editing-projects",
      accentColor: "from-cyan-500/20 via-blue-600/10 to-transparent",
      borderColor: "border-cyan-500/30 hover:border-cyan-400/60",
      glowColor: "rgba(6, 182, 212, 0.25)",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      description: "High-retention video editing and kinetic typography engineered for viral TikToks, Instagram Reels, commercial promos, and dynamic product showcases.",
      highlights: ["Kinetic Motion Graphics", "Viral Short-Form Reels & Ads", "Color Grading & Sound Design"]
    },
    {
      title: "UI/UX Design",
      tool: "Figma & Interactive Design",
      icon: Layers,
      targetId: "ui-ux-projects",
      accentColor: "from-rose-500/20 via-blue-600/10 to-transparent",
      borderColor: "border-rose-500/30 hover:border-rose-400/60",
      glowColor: "rgba(244, 63, 94, 0.25)",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      description: "Figma-driven human-centered design systems, responsive web interfaces, interactive prototyping, and seamless handoff to modern front-end code.",
      highlights: ["Figma Design Systems", "Interactive Mobile & Web Prototypes", "Micro-Interactions & Wireframing"]
    }
  ];

  const projects = [
    {
      id: "tshirt-collection",
      title: "Photoshop Apparel & Custom T-Shirt Collection",
      category: "Graphic Design",
      badge: "Graphic Design • Apparel & Merch",
      pillar: "Graphic Design",
      description: "A curated collection of print-ready, all-over sublimation and graphic apparel designs crafted in Adobe Photoshop for merchandise, apparel brands, and print-on-demand.",
      tags: ["Photoshop", "Apparel & Merch", "Sublimation", "Print-On-Demand"],
      gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
      borderAccent: "hover:border-amber-400/60",
      hasShowcase: true
    },
    {
      id: "pixeleye-finalist",
      title: "Wild by Nature — Pixel Eye Designathon Finalist",
      category: "Graphic Design",
      badge: "Photoshop Manipulation • Finalist Project",
      pillar: "Graphic Design",
      description: "Digital photo composite created for the Pixel Eye Designathon at Rajarata University of Sri Lanka, qualifying as a Top Finalist design.",
      tags: ["Adobe Photoshop", "Photo Manipulation", "Pixel Eye Finalist", "Color Grading"],
      gradient: "from-emerald-500/20 via-teal-600/10 to-transparent",
      borderAccent: "hover:border-emerald-400/60",
      hasShowcase: true
    },
    {
      id: "sliot-video",
      title: "SLIoT Challenge — Semi-Finalist Video Submission",
      category: "Video Editing & Motion",
      badge: "Video Editing & Direction • CapCut Motion",
      pillar: "Video Editing & Motion",
      description: "End-to-end video production directed and edited in CapCut for the SLIoT national competition video submission round, successfully qualifying for the Semi-Finals.",
      tags: ["CapCut", "Video Direction", "Scriptwriting", "SLIoT Semi-Finalist", "Cinematography"],
      gradient: "from-cyan-600/20 via-blue-600/10 to-transparent",
      borderAccent: "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_15px_35px_rgba(6,182,212,0.15)]",
      hasShowcase: true
    },

    {
      id: "aids-day-poster",
      title: "World AIDS Day Poster — 5th Place Winner",
      category: "Graphic Design",
      badge: "Photoshop Editing • Award Winner",
      pillar: "Graphic Design",
      description: "Award-winning public health awareness poster crafted in Adobe Photoshop, securing 5th Place at the university-wide World AIDS Day design competition.",
      tags: ["Adobe Photoshop", "5th Place Winner", "Photo Editing", "Health Advocacy"],
      gradient: "from-rose-600/20 via-red-600/10 to-transparent",
      borderAccent: "border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/20",
      hasShowcase: true
    },
    {
      id: "credentials-honors",
      title: "Design Credentials & Official Honors",
      category: "Graphic Design",
      badge: "Graphic Design • National Honors",
      pillar: "Graphic Design",
      description: "National finalist distinction (Top 12 in Sri Lanka) at Pixel Eye V6.0 and official appointment as Editor of the Technological Advancement Society.",
      tags: ["Pixel Eye Top 12", "National Finalist", "Society Editor", "Official Credential"],
      gradient: "from-amber-500/20 via-yellow-600/10 to-transparent",
      borderAccent: "hover:border-amber-400/70 hover:shadow-amber-500/10",
      hasShowcase: true
    },
    {
      id: "fiverr-promo",
      title: "Fiverr Commercial Video Editing — Service Promo Reel",
      category: "Video Editing & Motion",
      badge: "Commercial Video • CapCut Motion",
      subtitle: "High-Converting Freelance Service Showcase",
      pillar: "Video Editing & Motion",
      description: "Complete promotional video engineered from scratch in CapCut to launch a professional video editing gig on Fiverr, showcasing rapid retention edits and motion hooks.",
      tags: ["CapCut", "Commercial Promo", "Scriptwriting", "Fiverr Showcase", "Kinetic Typography"],
      gradient: "from-blue-600/20 via-cyan-600/10 to-transparent",
      borderAccent: "border-blue-500/30 hover:border-blue-400/70 hover:shadow-[0_15px_35px_rgba(59,130,246,0.15)]",
      hasShowcase: true
    },
    {
      id: "mediloop-platform",
      title: "MediLoop — Smart Healthcare Equipment Platform",
      category: "UI/UX Design",
      badge: "UI/UX & Design System • DHack Semi-Finalist",
      subtitle: "National Health-Tech Hackathon Semi-Finalist Selection",
      pillar: "UI/UX Design",
      description: "Complete mobile application UI/UX designed in Figma for DHack Hackathon, featuring a clean human-centered design system for renting, purchasing, and managing medical equipment.",
      tags: ["Figma", "UI/UX Architecture", "DHack Semi-Finalist", "HealthTech", "Design System", "Mobile App"],
      gradient: "from-emerald-500/15 via-teal-950/20 to-[#090D16]/90",
      borderAccent: "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)]",
      hasShowcase: true
    }
  ];

  const categorySections = [
    {
      id: "graphic-design-projects",
      title: "Graphic Design Showcase",
      subtitle: "Photoshop mastery, distinctive branding, key visuals & digital art",
      icon: Palette,
      badge: "Adobe Photoshop & Illustrator",
      badgeColor: "border-blue-500/30 bg-blue-950/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]",
      accentColor: "text-blue-400",
      projects: projects.filter(p => p.category === "Graphic Design")
    },
    {
      id: "video-editing-projects",
      title: "Video Editing & Motion Showcase",
      subtitle: "High-impact CapCut storytelling, kinetic typography & viral reels",
      icon: Video,
      badge: "CapCut Motion Graphics",
      badgeColor: "border-cyan-500/30 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
      accentColor: "text-cyan-400",
      projects: projects.filter(p => p.category === "Video Editing & Motion")
    },
    {
      id: "ui-ux-projects",
      title: "UI/UX Design Showcase",
      subtitle: "Figma-driven interactive interfaces, user journeys & responsive systems",
      icon: Layers,
      badge: "Figma Interactive Design",
      badgeColor: "border-rose-500/30 bg-rose-950/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
      accentColor: "text-rose-400",
      projects: projects.filter(p => p.category === "UI/UX Design")
    }
  ];

  const skillsList = [
    { name: "Adobe Photoshop", category: "Graphic Design", level: "Expert", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { name: "CapCut Motion", category: "Video & Reels", level: "Advanced", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { name: "Figma UI/UX", category: "Interactive Design", level: "Advanced", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
    { name: "Adobe Illustrator", category: "Vector Graphics", level: "Advanced", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { name: "Design Systems", category: "UI/UX Architecture", level: "Specialist", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { name: "Kinetic Typography", category: "Video & Motion", level: "Advanced", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { name: "Brand Identity", category: "Visual Arts", level: "Specialist", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { name: "React & Tailwind", category: "Frontend Implementation", level: "Intermediate", color: "text-slate-300 border-cyan-500/30 bg-cyan-500/10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090D16] via-[#0B1120] to-[#090D16] text-[#F8FAFC] font-sans selection:bg-cyan-400 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Background Studio Ambient Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[680px] h-[680px] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-1/4 -right-40 w-[720px] h-[720px] bg-gradient-to-bl from-blue-600/15 via-cyan-700/10 to-transparent rounded-full blur-[170px]" />
        <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-rose-500/10 via-blue-600/10 to-transparent rounded-full blur-[160px]" />
        {/* Subtle digital dot-matrix pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-800/80 z-50 px-6 md:px-16 py-3.5 flex justify-between items-center transition-all">
        {/* Brand with Glowing Profile Picture */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            aria-label="View profile photo"
            className="relative group cursor-pointer hover:scale-105 transition-transform focus:outline-none rounded-full"
          >
            {/* Animated Cyber-Cyan Pulse Glow */}
            <div className="absolute -inset-1 rounded-full bg-cyan-400/40 blur-[4px] group-hover:bg-cyan-400/70 animate-pulse transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-full ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={profileImg}
                alt="Kalana"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/profile.png';
                }}
              />
            </div>
            {/* Status dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 border-2 border-[#090D16] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          </button>

          <a href="#" className="flex flex-col">
            <span className="text-xl font-black tracking-widest bg-gradient-to-r from-slate-100 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              KALANA<span className="text-cyan-400">.</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-cyan-400/90 -mt-1">
              Creative Designer
            </span>
          </a>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#94A3B8]">
          <a href="#about" className="hover:text-cyan-300 transition-colors">About</a>
          <a href="#pillars" className="hover:text-cyan-300 transition-colors">Pillars</a>
          <a href="#projects" className="hover:text-cyan-300 transition-colors">Projects</a>
          <a href="#skills" className="hover:text-cyan-300 transition-colors">Toolkit</a>
          
          {/* Glowing CV Modal Trigger Button (Desktop) */}
          <button
            type="button"
            onClick={() => setIsCvOpen(true)}
            aria-label="View Curriculum Vitae"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all duration-300 text-xs font-semibold cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>CV</span>
          </button>

          <a
            href="#contact"
            className="px-4 py-2 rounded-xl backdrop-blur-md bg-slate-900/60 border border-slate-800/80 hover:border-cyan-400/70 text-[#F8FAFC] hover:text-cyan-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all duration-300 text-xs font-semibold"
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile Navigation Bar Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Glowing CV Modal Trigger Button (Mobile) */}
          <button
            type="button"
            onClick={() => setIsCvOpen(true)}
            aria-label="View Curriculum Vitae"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all text-xs font-semibold cursor-pointer active:scale-95"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>CV</span>
          </button>

          <a
            href="#contact"
            className="px-3 py-1.5 rounded-xl backdrop-blur-md bg-slate-900/60 border border-slate-800/80 text-[#F8FAFC] hover:text-cyan-300 transition-all text-xs font-semibold"
          >
            Get In Touch
          </a>
        </div>
      </nav>

      {/* HERO SECTION (2-Column Desktop / Gracefully Stacked Mobile) */}
      <section className="relative z-10 min-h-screen pt-28 md:pt-32 pb-16 px-6 md:px-16 max-w-7xl mx-auto flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT SIDE: Interactive 3D Animated Walking & Waving Robot Mascot (Three.js / React Three Fiber) */}
          <div className="lg:col-span-6 flex justify-center items-center order-1 lg:order-1 relative w-full">
            {/* 3D Canvas Container scaled to h-[520px] md:h-[620px] w-full */}
            <div
              ref={robotContainerRef}
              onMouseMove={handleRobotMouseMove}
              onMouseLeave={handleRobotMouseLeave}
              className="relative w-full h-[520px] md:h-[620px] mx-auto flex items-center justify-center select-none group bg-transparent"
              style={{
                perspective: '1200px'
              }}
            >
              {/* Behind the 3D robot: soft layered glow mesh (cyan-500/15 and blue-600/15) */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-500/15 via-blue-600/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
              <div className="absolute inset-4 bg-gradient-to-bl from-blue-600/15 via-cyan-400/10 to-transparent blur-2xl -z-10 pointer-events-none rounded-full" />

              {/* Seamless Transparent 3D Canvas wrapper */}
              <div
                className="relative w-full h-full bg-transparent flex items-center justify-center"
                style={{
                  transform: `rotateY(${robotMousePos.x * 4}deg) rotateX(${-robotMousePos.y * 4}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
              >
                {/* React Three Fiber Canvas with Official Expressive Robot Model */}
                <div className="w-full h-full flex items-center justify-center bg-transparent">
                  <RobotErrorBoundary
                    fallback={
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
                        <Bot className="w-12 h-12 text-cyan-400 mb-3 animate-bounce" />
                        <p className="text-sm font-semibold text-slate-200">3D Robot Mascot</p>
                        <p className="text-xs text-slate-500 mt-1">Interactive walking robot ready</p>
                      </div>
                    }
                  >
                    <Canvas
                      camera={{ position: [0, 0.2, 5.2], fov: 45 }}
                      className="w-full h-full cursor-grab active:cursor-grabbing bg-transparent"
                      gl={{ antialias: true, alpha: true }}
                    >
                      {/* Balanced clean studio lighting */}
                      <ambientLight intensity={0.7} />
                      <directionalLight position={[0, 3, 5]} intensity={1.2} color="#ffffff" />
                      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#e2e8f0" />

                      {/* Smooth Suspense fallback loader */}
                      <Suspense fallback={<RobotLoader />}>
                        <RobotModel />
                      </Suspense>

                      {/* OrbitControls: rotate left/right without flipping */}
                      <OrbitControls
                        enableZoom={false}
                        autoRotate={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 3}
                        target={[0, -0.2, 0]}
                      />
                    </Canvas>
                  </RobotErrorBoundary>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Hero Content & Role Positioning */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
            
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full backdrop-blur-md bg-slate-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/15">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Available for Creative Commissions & Projects</span>
            </div>

            {/* Primary Headline with Bold Gradient Accent */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight mb-5 leading-[1.1] text-[#F8FAFC]">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                Kalana
              </span>
            </h1>

            {/* Creative Tagline & Description with Three Core Disciplines */}
            <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] max-w-2xl mb-6 font-normal leading-relaxed">
              <span className="font-semibold text-[#F8FAFC]">Creative Multimedia Designer</span> specializing in crafted visual narratives across three core disciplines:
            </p>

            <ul className="space-y-2.5 mb-8 text-sm sm:text-base text-[#94A3B8] text-left max-w-xl">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <span>
                  <strong className="text-[#F8FAFC] font-semibold">Graphic Design:</strong> Photoshop mastery, distinctive branding, key visuals & digital art.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <span>
                  <strong className="text-[#F8FAFC] font-semibold">Video Editing & Motion:</strong> High-impact CapCut storytelling, kinetic typography & viral reels.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                <span>
                  <strong className="text-[#F8FAFC] font-semibold">UI/UX Design:</strong> Figma-driven interactive interfaces, user journeys & responsive systems.
                </span>
              </li>
            </ul>

            {/* Modern Visual Skill Badges / Pills under Headline */}
            <div className="flex flex-wrap gap-3 mb-9 justify-center lg:justify-start">
              
              {/* Photoshop Badge: Royal blue glass badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border border-blue-500/30 bg-blue-950/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all">
                <span className="w-6 h-6 rounded bg-blue-500/20 border border-blue-400/40 text-blue-300 font-black text-xs flex items-center justify-center">
                  Ps
                </span>
                <span className="text-xs font-semibold text-slate-200 tracking-wide">
                  Photoshop
                </span>
              </div>

              {/* CapCut Badge: Sleek cyan/white glass badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all">
                <span className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                  <Film className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-slate-200 tracking-wide">
                  CapCut
                </span>
              </div>

              {/* Figma Badge: Subtle coral/purple glass badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border border-rose-500/30 bg-rose-950/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)] hover:border-rose-400/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all">
                <span className="w-6 h-6 rounded bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center font-bold text-xs">
                  <Layers className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-slate-200 tracking-wide">
                  Figma
                </span>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="group flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300 px-8 py-3.5 rounded-xl"
              >
                <span>Explore Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="flex items-center gap-2 border border-slate-700 bg-slate-900/50 text-slate-200 hover:border-cyan-400/50 hover:bg-slate-800/60 transition-all font-medium px-8 py-3.5 rounded-xl shadow-md"
              >
                <span>Get in Touch</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* CREATIVE PILLARS SHOWCASE SECTION */}
      <section id="pillars" className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            Core Competencies
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#F8FAFC] mt-2 mb-4">
            Creative Multimedia Pillars
          </h2>
          <p className="text-[#94A3B8] text-base">
            Delivering cohesive multi-platform experiences from striking static visuals to dynamic motion and intuitive user interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creativePillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => scrollToAnchor(pillar.targetId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToAnchor(pillar.targetId);
                  }
                }}
                className={`relative rounded-2xl bg-gradient-to-b ${pillar.accentColor} backdrop-blur-md bg-slate-900/60 border ${pillar.borderColor} p-8 flex flex-col justify-between cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-2xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-xl backdrop-blur-md bg-slate-950/80 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${pillar.badgeColor}`}>
                      {pillar.tool}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3 group-hover:text-cyan-300 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                  {pillar.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="pt-3.5 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span>Explore {pillar.title} Projects</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION (Sequential Categorized Showcases) */}
      <section id="projects" className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            Curated Portfolio Gallery
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] mt-2 mb-4 tracking-tight">
            Featured Creative Projects
          </h2>
          <p className="text-[#94A3B8] text-base md:text-lg">
            Explore complete case studies spanning brand identity & graphic art, high-velocity motion reels, and interactive UI/UX prototypes.
          </p>
        </div>

        {/* Sequential Categorized Showcases */}
        <div className="space-y-20">
          {categorySections.map((sec) => {
            const SecIcon = sec.icon;
            return (
              <div
                key={sec.id}
                id={sec.id}
                className="scroll-mt-24 md:scroll-mt-28"
              >
                {/* Sub-section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl backdrop-blur-md bg-slate-950/80 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-md">
                      <SecIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-[#F8FAFC] tracking-tight">
                        {sec.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#94A3B8] mt-0.5 font-normal">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center self-start sm:self-auto text-xs font-semibold px-3.5 py-1.5 rounded-full border backdrop-blur-md ${sec.badgeColor}`}>
                    {sec.badge}
                  </span>
                </div>

                {/* Projects Grid for this Category */}
                <div className={sec.id === "ui-ux-projects" ? "w-full max-w-3xl mx-auto" : (sec.id === "graphic-design-projects" || sec.id === "video-editing-projects" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-8")}>
                  {sec.projects.map((proj, idx) => {
                    const isClickable = !!proj.hasShowcase;
                    const isGraphicDesign = sec.id === "graphic-design-projects";

                    const handleCardOpen = () => {
                      if (proj.id === "mediloop-platform") {
                        setIsMediloopModalOpen(true);
                      } else if (proj.id === "pixeleye-finalist") {
                        setIsPixelEyeModalOpen(true);
                      } else if (proj.id === "aids-day-poster") {
                        setIsAidsModalOpen(true);
                      } else if (proj.id === "credentials-honors") {
                        setIsCertModalOpen(true);
                        setIsCertZoomed(false);
                      } else if (proj.id === "sliot-video") {
                        setIsSliotModalOpen(true);
                      } else if (proj.id === "fiverr-promo") {
                        setIsFiverrModalOpen(true);
                      } else if (proj.hasShowcase) {
                        setActiveDesignIndex(0);
                        setIsTshirtGalleryOpen(true);
                      }
                    };

                    // Distinct vertical gradient and glow per card in Showcases
                    let cardStyle = "backdrop-blur-md bg-slate-900/60 border border-slate-800/80 p-7 md:p-8";
                    let titleHoverColor = "group-hover:text-cyan-300";

                    if (proj.id === "mediloop-platform") {
                      cardStyle = "max-w-3xl mx-auto w-full cursor-pointer group bg-gradient-to-b from-emerald-500/15 via-teal-950/20 to-[#090D16]/90 border border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)] p-7 md:p-9";
                      titleHoverColor = "group-hover:text-emerald-300";
                    } else if (proj.id === "sliot-video") {
                      cardStyle = "bg-gradient-to-b from-cyan-500/15 via-blue-950/20 to-[#090D16]/90 border border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_15px_35px_rgba(6,182,212,0.15)] p-6 md:p-7";
                      titleHoverColor = "group-hover:text-cyan-300";
                    } else if (proj.id === "fiverr-promo") {
                      cardStyle = "bg-gradient-to-b from-blue-500/15 via-cyan-950/20 to-[#090D16]/90 border border-blue-500/30 hover:border-blue-400/70 hover:shadow-[0_15px_35px_rgba(59,130,246,0.15)] p-6 md:p-7";
                      titleHoverColor = "group-hover:text-blue-300";
                    } else if (isGraphicDesign) {
                      if (proj.id === "tshirt-collection") {
                        cardStyle = "bg-gradient-to-b from-amber-500/15 via-orange-950/20 to-[#090D16]/90 border border-amber-500/30 hover:border-amber-400/70 hover:shadow-[0_15px_35px_rgba(245,158,11,0.15)] p-6 md:p-7";
                        titleHoverColor = "group-hover:text-amber-300";
                      } else if (proj.id === "pixeleye-finalist") {
                        cardStyle = "bg-gradient-to-b from-emerald-500/15 via-teal-950/20 to-[#090D16]/90 border border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)] p-6 md:p-7";
                        titleHoverColor = "group-hover:text-emerald-300";
                      } else if (proj.id === "aids-day-poster") {
                        cardStyle = "bg-gradient-to-b from-rose-500/15 via-red-950/20 to-[#090D16]/90 border border-rose-500/30 hover:border-rose-400/70 hover:shadow-[0_15px_35px_rgba(244,63,94,0.15)] p-6 md:p-7";
                        titleHoverColor = "group-hover:text-rose-300";
                      } else if (proj.id === "credentials-honors") {
                        cardStyle = "bg-gradient-to-b from-blue-500/15 via-indigo-950/20 to-[#090D16]/90 border border-blue-500/30 hover:border-blue-400/70 hover:shadow-[0_15px_35px_rgba(59,130,246,0.15)] p-6 md:p-7";
                        titleHoverColor = "group-hover:text-blue-300";
                      }
                    } else {
                      cardStyle = `backdrop-blur-md bg-slate-900/60 border border-slate-800/80 ${proj.borderAccent} hover:shadow-2xl hover:shadow-cyan-500/10 p-7 md:p-8`;
                    }

                    return (
                      <div
                        key={idx}
                        role={isClickable ? "button" : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onClick={handleCardOpen}
                        onKeyDown={(e) => {
                          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            handleCardOpen();
                          }
                        }}
                        className={`rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl group ${cardStyle} ${
                          isClickable ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400' : ''
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className={`text-xs font-bold tracking-wider uppercase ${proj.id === 'mediloop-platform' ? 'text-emerald-400' : sec.accentColor}`}>
                              {proj.category}
                            </span>
                            <span className={`text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              proj.id === 'mediloop-platform'
                                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm'
                                : 'bg-slate-950/80 border border-slate-800 text-slate-300'
                            }`}>
                              {proj.badge}
                            </span>
                          </div>

                          <h4 className={`text-xl md:text-2xl font-bold text-[#F8FAFC] mt-1 mb-2 ${titleHoverColor} transition-colors flex items-center justify-between gap-2`}>
                            <span>{proj.title}</span>
                            {isClickable && (
                              <span className={`shrink-0 p-1.5 rounded-lg border transition-transform group-hover:scale-110 ${
                                proj.id === 'mediloop-platform'
                                  ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-400'
                                  : proj.id === 'pixeleye-finalist'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : proj.id === 'aids-day-poster'
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                  : proj.id === 'credentials-honors'
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                  : proj.id === 'sliot-video'
                                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                  : proj.id === 'fiverr-promo'
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              }`}>
                                {proj.id === 'mediloop-platform' || proj.id === 'pixeleye-finalist' ? (
                                  <Sparkles className="w-4 h-4 text-emerald-400" />
                                ) : proj.id === 'aids-day-poster' ? (
                                  <Sparkles className="w-4 h-4 text-rose-400" />
                                ) : proj.id === 'credentials-honors' ? (
                                  <Sparkles className="w-4 h-4 text-blue-400" />
                                ) : proj.id === 'sliot-video' || proj.id === 'fiverr-promo' ? (
                                  <Video className="w-4 h-4 text-cyan-400" />
                                ) : (
                                  <Shirt className="w-4 h-4 text-amber-400" />
                                )}
                              </span>
                            )}
                          </h4>

                          {proj.subtitle && (
                            <p className="text-xs md:text-sm font-semibold text-emerald-400/90 mb-3 tracking-wide">
                              {proj.subtitle}
                            </p>
                          )}

                          <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed mb-6">
                            {proj.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800/80 space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {proj.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className={`text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-950/80 border ${
                                  proj.id === 'mediloop-platform'
                                    ? 'border-emerald-500/25 text-emerald-200/90'
                                    : 'border-slate-800/80 text-slate-300'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {isClickable && (
                            <div className="pt-1 flex items-center justify-between text-xs font-bold transition-colors">
                              {proj.id === "mediloop-platform" ? (
                                <>
                                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    DHack Semi-Finalist
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsMediloopModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 group-hover:bg-emerald-500/25 group-hover:border-emerald-400/70 transition-all text-emerald-300 hover:text-emerald-200 shadow-md cursor-pointer font-bold"
                                  >
                                    Explore MediLoop App Experience →
                                  </button>
                                </>
                              ) : proj.id === "pixeleye-finalist" ? (
                                <>
                                  <span className="flex items-center gap-1.5 text-emerald-400">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    Designathon Finalist
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsPixelEyeModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/60 transition-all text-emerald-300 cursor-pointer"
                                  >
                                    View Finalist Artwork →
                                  </button>
                                </>
                              ) : proj.id === "aids-day-poster" ? (
                                <>
                                  <span className="flex items-center gap-1.5 text-rose-400">
                                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                                    5th Place Award Winner
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsAidsModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 group-hover:bg-rose-500/20 group-hover:border-rose-400/60 transition-all text-rose-300 cursor-pointer"
                                  >
                                    View Awarded Artwork →
                                  </button>
                                </>
                              ) : proj.id === "credentials-honors" ? (
                                <>
                                  <span className="flex items-center gap-1.5 text-blue-400">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                    National Honors
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsCertModalOpen(true);
                                      setIsCertZoomed(false);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 group-hover:bg-blue-500/20 group-hover:border-blue-400/60 transition-all text-blue-300 cursor-pointer"
                                  >
                                    View Certificates & Details →
                                  </button>
                                </>
                              ) : proj.id === "sliot-video" ? (
                                <>
                                  <span className="flex items-center gap-1.5 text-cyan-400">
                                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                                    SLIoT Semi-Finalist
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsSliotModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/60 transition-all text-cyan-300 cursor-pointer"
                                  >
                                    Watch Submission Video →
                                  </button>
                                </>
                              ) : proj.id === "fiverr-promo" ? (
                                <>
                                  <span className="flex items-center gap-1.5 text-blue-400">
                                    <Video className="w-3.5 h-3.5 text-blue-400" />
                                    Commercial Promo
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsFiverrModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 group-hover:bg-blue-500/20 group-hover:border-blue-400/60 transition-all text-blue-300 cursor-pointer"
                                  >
                                    Watch Promo Reel →
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1.5 text-amber-400">
                                    <Shirt className="w-3.5 h-3.5 text-amber-400" />
                                    Apparel Collection
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsTshirtGalleryOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:border-amber-400/60 transition-all text-amber-300 cursor-pointer"
                                  >
                                    Explore Full T-Shirt Collection →
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SKILLS & TOOLKIT SECTION */}
      <section id="skills" className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            Specialized Stack
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#F8FAFC] mt-2 mb-4">
            Creative Tools & Competencies
          </h2>
          <p className="text-[#94A3B8] text-base">
            Trained and experienced across industry-standard graphic, motion, and digital design platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {skillsList.map((skill, index) => (
            <div
              key={index}
              className="p-5 rounded-xl backdrop-blur-md bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                  {skill.category}
                </span>
                <h4 className="text-base font-bold text-[#F8FAFC] group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h4>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${skill.color}`}>
                  {skill.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 py-24 px-6 md:px-16 max-w-5xl mx-auto border-t border-slate-800/60 text-center">
        <div className="inline-block p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6 shadow-lg shadow-cyan-500/10">
          <Brush className="w-6 h-6" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[#F8FAFC] mb-6">
          Behind the Canvas
        </h2>
        <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light">
          I am Kalana — a multidisciplinary creative designer dedicated to producing visuals that captivate and convert. By unifying{" "}
          <span className="text-blue-400 font-medium">Photoshop graphic mastery</span>,{" "}
          <span className="text-cyan-400 font-medium">dynamic CapCut video storytelling</span>, and{" "}
          <span className="text-rose-400 font-medium">Figma UI/UX architecture</span>, I craft end-to-end digital assets that elevate modern brands. Currently pursuing my degree in{" "}
          <span className="text-emerald-400 font-medium">Biomedical Technology</span>, my flexible academic schedule enables me to dedicate substantial hours and focused commitment to high-impact{" "}
          <span className="text-cyan-300 font-medium underline underline-offset-4 decoration-cyan-500/50">remote collaborations</span> worldwide.
        </p>
      </section>

      {/* CONTACT & CTA SECTION */}
      <section id="contact" className="relative z-10 py-24 px-6 md:px-16 max-w-4xl mx-auto text-center border-t border-slate-800/60">
        <div className="p-8 md:p-14 rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 via-[#0B1120]/95 to-blue-950/30 border border-slate-800/90 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            Let's Collaborate
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] mt-3 mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto text-base">
            Whether you need bespoke brand visuals, viral motion reels, or an interactive UI/UX design system, let's create something extraordinary.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:your-email@example.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Say Hello & Commission Work</span>
            </a>
          </div>

          <div className="mt-10 flex justify-center space-x-6 text-slate-400">
            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-cyan-400 transition-colors p-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-cyan-400 transition-colors p-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-cyan-400 transition-colors p-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 text-center text-slate-500 text-xs border-t border-slate-800/60">
        <p>© {new Date().getFullYear()} Kalana. All rights reserved. Creative Multimedia Designer.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Crafted with Photoshop, CapCut, Figma & React.
        </p>
      </footer>

      {/* Interactive Profile Photo Lightbox Modal */}
      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Profile Photo Lightbox"
          onClick={() => setIsProfileOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4 cursor-pointer"
        >
          <div
            className="relative flex flex-col items-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accessible Close Button */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(false)}
              aria-label="Close profile modal"
              className="absolute -top-12 right-0 md:-right-8 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Popup: Large circular image preview */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-rose-500 opacity-70 blur-md animate-pulse pointer-events-none"></div>
              <img
                src={profileImg}
                alt="Kalana Profile Preview"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover ring-4 ring-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-scaleUp"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/profile.png';
                }}
              />
            </div>

            {/* Profile Info Caption */}
            <div className="mt-5 text-center">
              <h3 className="text-xl font-bold text-white tracking-wide">
                Kalana
              </h3>
              <p className="text-xs text-cyan-400 font-semibold tracking-wider uppercase mt-1">
                Creative Multimedia Designer
              </p>
              <span className="inline-block mt-2.5 text-[11px] font-medium text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
                Press <kbd className="font-mono text-slate-200">Esc</kbd> or click anywhere to close
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Curriculum Vitae (CV) Lightbox Modal */}
      {isCvOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Curriculum Vitae Modal"
          onClick={() => setIsCvOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn p-3 sm:p-6 cursor-pointer"
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-950/95 border border-slate-800/90 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
                    Curriculum Vitae — Kalana Thotagama
                  </h3>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Graphic Designer & Biomedical Technology
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download + Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/kalana-cv.jpg"
                  download="Kalana_Thotagama_CV.jpg"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsCvOpen(false)}
                  aria-label="Close CV modal"
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Centered Image Container */}
            <div className="overflow-y-auto max-h-[calc(92vh-70px)] p-3 sm:p-6 flex justify-center items-start bg-slate-950/80">
              <div className="relative group max-w-2xl w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-white">
                <img
                  src="/kalana-cv.jpg"
                  alt="Curriculum Vitae - Kalana Thotagama"
                  className="w-full h-auto object-contain select-none"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Scrollable Interactive Showcase View: Photoshop Custom T-Shirt Design Portfolio */}
      {isTshirtGalleryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photoshop Custom T-Shirt Design Portfolio"
          className="fixed inset-0 z-50 bg-[#090D16]/98 backdrop-blur-2xl overflow-y-auto overflow-x-hidden animate-fadeIn"
        >
          {/* Fixed/Sticky Top Header Bar */}
          <header className="sticky top-0 z-50 bg-[#090D16]/90 backdrop-blur-lg border-b border-slate-800/60 px-4 sm:px-8 py-3.5 sm:py-4 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Header Title & Branding */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                  <Shirt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-[#F8FAFC] tracking-tight truncate">
                    Photoshop Custom T-Shirt Design Portfolio
                  </h2>
                  <span className="text-[10px] sm:text-xs font-semibold text-amber-400/90 block truncate">
                    Curated All-Over Sublimation & Apparel Merch
                  </span>
                </div>
              </div>

              {/* Item Counter & Direct Jump Nav */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/95 border border-slate-700/80 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {activeDesignIndex + 1} of {tshirtCollection.length}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                  {tshirtCollection.map((d, i) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        document.getElementById(`tshirt-design-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
                        activeDesignIndex === i
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      Design 0{i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prominent 'CLOSE ✕' Button */}
              <button
                type="button"
                onClick={() => setIsTshirtGalleryOpen(false)}
                aria-label="Close showcase modal"
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition-all duration-200 shadow-xl cursor-pointer group shrink-0 font-bold"
              >
                <span className="text-xs font-black tracking-wider uppercase">CLOSE ✕</span>
              </button>
            </div>
          </header>

          {/* Continuous Vertical Scrollable Sections */}
          <div className="w-full">
            {tshirtCollection.map((design, index) => (
              <TshirtProjectSection
                key={design.id}
                design={design}
                index={index}
                total={tshirtCollection.length}
                onVisible={(idx) => setActiveDesignIndex(idx)}
              />
            ))}
          </div>

          {/* Bottom Showcase Footer */}
          <div className="py-12 px-6 text-center border-t border-slate-800/60 bg-[#090D16]/90">
            <p className="text-xs text-slate-400 mb-4">
              Photoshop Custom T-Shirt Design Portfolio • Engineered at 300 DPI for All-Over Dye Sublimation
            </p>
            <button
              type="button"
              onClick={() => setIsTshirtGalleryOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Back to Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pixel Eye Designathon Finalist Modal */}
      {isPixelEyeModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPixelEyeModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl overflow-y-auto p-4 md:p-10 flex flex-col items-center animate-fadeIn"
        >
          {/* Floating Top-Right Close Button */}
          <button 
            type="button"
            onClick={() => setIsPixelEyeModalOpen(false)}
            aria-label="Close modal"
            className="fixed top-5 right-5 md:top-8 md:right-8 z-50 rounded-xl bg-slate-900/90 border border-slate-700/60 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer backdrop-blur-md shadow-2xl tracking-wider uppercase"
          >
            CLOSE ✕
          </button>

          <style>{`
            @keyframes slideDownCenter {
              0% { opacity: 0; transform: translateY(-60px) scale(0.96); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes fadeUpDelayed {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Centered Vertical Layout */}
          <div 
            className="w-full max-w-4xl flex flex-col items-center my-auto py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Center: Prominent Artwork with Top-to-Bottom Slide-in */}
            <div 
              className="relative flex justify-center items-center w-full"
              style={{ animation: 'slideDownCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <img 
                src="/assets/projects/pixeleye-final.jpg" 
                alt="Wild by Nature Pixel Eye Finalist" 
                className="max-h-[65vh] w-auto object-contain rounded-2xl shadow-[0_25px_60px_rgba(16,185,129,0.25)] border border-emerald-500/20"
              />
            </div>

            {/* Project Details Directly Underneath with Delayed Fade-Up */}
            <div 
              className="max-w-3xl w-full text-center mt-8 space-y-4"
              style={{ animation: 'fadeUpDelayed 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Pixel Eye V6.0 — Grand Finalist
                </span>
                <span className="text-xs text-slate-400">Rajarata University of Sri Lanka</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Wild by Nature, Ours to Protect
              </h2>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Created for <strong>Pixel Eye V6.0</strong>, the national inter-university design competition organized by the Business Information Technology Students' Association, Rajarata University of Sri Lanka. Selected as a Top Finalist entry.
              </p>

              {/* Concept & Highlights Cleanly Stacked */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs text-left max-w-2xl mx-auto">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-sm">
                  <span className="font-bold text-emerald-400 block mb-1">Theme & Concept</span>
                  <p className="text-slate-300 leading-relaxed">
                    Wildlife conservation and biodiversity awareness, emphasizing the harmonious co-existence of land and marine ecosystems.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-sm">
                  <span className="font-bold text-emerald-400 block mb-1">Photoshop Execution</span>
                  <p className="text-slate-300 leading-relaxed">
                    Multi-layered composite blending terrestrial wildlife with marine life, finished with ambient sun rays and bespoke foliage typography.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* World AIDS Day Awareness & Prevention Poster Modal */}
      {isAidsModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAidsModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl overflow-y-auto p-4 md:p-10 flex flex-col items-center animate-fadeIn"
        >
          {/* Floating Top-Right Close Button */}
          <button 
            type="button"
            onClick={() => setIsAidsModalOpen(false)}
            aria-label="Close modal"
            className="fixed top-5 right-5 md:top-8 md:right-8 z-50 rounded-xl bg-slate-900/90 border border-slate-700/60 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer backdrop-blur-md shadow-2xl tracking-wider uppercase"
          >
            CLOSE ✕
          </button>

          {/* Centered Vertical Layout */}
          <div 
            className="w-full max-w-4xl flex flex-col items-center my-auto py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Center: Prominent Artwork with Top-to-Bottom Slide-in */}
            <div 
              className="relative flex justify-center items-center w-full"
              style={{ animation: 'slideDownCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <img 
                src="/assets/projects/aids-day-poster.jpg" 
                alt="World AIDS Day — 5th Place Winner" 
                className="max-h-[62vh] w-auto object-contain rounded-2xl border border-rose-500/30 shadow-[0_25px_60px_rgba(244,63,94,0.25)]"
              />
            </div>

            {/* Description Section Directly Underneath with Delayed Fade-Up */}
            <div 
              className="max-w-3xl w-full text-center mt-8 space-y-4"
              style={{ animation: 'fadeUpDelayed 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  🏆 5th Place Winner — University Poster Competition
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Know the Risk, Stop the Spread
              </h2>

              <p className="text-xs md:text-sm font-medium text-rose-400">
                World AIDS Day | Gampaha Wickramarachchi University of Indigenous Medicine
              </p>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Recognized as a Top 5 winning entry for outstanding visual communication, emotional resonance, and public health impact.
              </p>

              {/* Technical Photoshop Execution Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs text-left">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 backdrop-blur-sm">
                  <span className="font-bold text-rose-400 block mb-1">Advanced Compositing</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Multi-layer background integration depicting protective hands, ribbon symbolism, and clinical clarity.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 backdrop-blur-sm">
                  <span className="font-bold text-rose-400 block mb-1">Visual Hierarchy</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Structured layout balancing medical advisories, helpline contacts, and bold typographical hierarchy for maximum readability.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 backdrop-blur-sm">
                  <span className="font-bold text-rose-400 block mb-1">Color Correction</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    High-contrast red-and-white advocacy palette optimized for both digital viewing and print clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Design Credentials & Official Honors Modal - Continuous Vertical Scroll Feed */}
      {isCertModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setIsCertModalOpen(false);
            setIsCertZoomed(false);
          }}
          className="fixed inset-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl overflow-y-auto p-4 md:p-10 flex flex-col items-center animate-fadeIn"
        >
          {/* Sticky Top Header Bar */}
          <div 
            className="sticky top-0 z-40 w-full max-w-4xl flex items-center justify-between py-3.5 px-5 md:px-6 mb-8 rounded-2xl bg-[#090D16]/90 backdrop-blur-xl border border-amber-500/25 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                  Design Credentials & Official Honors
                </h3>
                <p className="text-[11px] text-amber-400/80 font-medium">
                  Verified Academic & National Competitions Archive
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => {
                setIsCertModalOpen(false);
                setIsCertZoomed(false);
              }}
              aria-label="Close modal"
              className="rounded-xl bg-slate-900/90 border border-slate-700/60 px-4 py-1.5 text-xs font-bold text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer shadow-xl tracking-wider uppercase"
            >
              CLOSE ✕
            </button>
          </div>

          {/* Continuous Vertical Scrolling Feed */}
          <div 
            className="w-full max-w-4xl flex flex-col items-center space-y-16 pb-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ============================================================ */}
            {/* CREDENTIAL 1: Pixel Eye V6.0 National All-Island Finalist     */}
            {/* ============================================================ */}
            <section className="w-full flex flex-col items-center">
              {/* Zoomable Image Container */}
              <div 
                onClick={() => setIsCertZoomed((prev) => (prev === 1 ? false : 1))}
                className={`relative w-full overflow-hidden rounded-2xl border border-amber-500/30 shadow-[0_25px_60px_rgba(245,158,11,0.25)] flex items-center justify-center transition-all duration-300 bg-black/40 ${
                  isCertZoomed === 1 ? 'cursor-zoom-out p-2' : 'cursor-zoom-in'
                }`}
                style={{ animation: 'slideDownCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
              >
                <img 
                  src="/assets/projects/pixeleye-cert.jpg" 
                  alt="Pixel Eye V6.0 Finalist Certificate" 
                  className={`w-auto object-contain transition-transform duration-300 ease-out select-none ${
                    isCertZoomed === 1 ? 'scale-150 md:scale-175 max-h-[85vh] my-14' : 'max-h-[62vh] scale-100 rounded-xl'
                  }`}
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/75 border border-amber-500/30 text-[11px] font-medium text-amber-300 backdrop-blur-md pointer-events-none shadow-lg">
                  {isCertZoomed === 1 ? "🔍 Click to Reset Zoom" : "🔍 Click to Zoom In (1.75x)"}
                </div>
              </div>

              {/* Credential 1 Details */}
              <div 
                className="max-w-3xl w-full text-center mt-6 space-y-3"
                style={{ animation: 'fadeUpDelayed 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    🏆 Pixel Eye V6.0 — National All-Island Finalist
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  All-Island Top 12 Finalist Selection
                </h2>

                <p className="text-xs md:text-sm font-medium text-amber-400">
                  BITSA, Rajarata University of Sri Lanka
                </p>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  Recognized as a Grand Finalist among the Top 12 competitors island-wide in digital compositing and Photoshop photo manipulation.
                </p>
              </div>
            </section>

            {/* Divider Between Credentials */}
            <div className="w-full flex items-center justify-center gap-4 max-w-2xl opacity-60">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Official Letter Below</span>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
            </div>

            {/* ============================================================ */}
            {/* CREDENTIAL 2: University Society Editor Appointment Letter   */}
            {/* ============================================================ */}
            <section className="w-full flex flex-col items-center">
              {/* Zoomable Image Container */}
              <div 
                onClick={() => setIsCertZoomed((prev) => (prev === 2 ? false : 2))}
                className={`relative w-full overflow-hidden rounded-2xl border border-blue-500/30 shadow-[0_25px_60px_rgba(59,130,246,0.25)] flex items-center justify-center transition-all duration-300 bg-black/40 ${
                  isCertZoomed === 2 ? 'cursor-zoom-out p-2' : 'cursor-zoom-in'
                }`}
              >
                <img 
                  src="/assets/projects/editor-appointment.jpg" 
                  alt="University Society Editor Appointment Letter" 
                  className={`w-auto object-contain transition-transform duration-300 ease-out select-none ${
                    isCertZoomed === 2 ? 'scale-150 md:scale-175 max-h-[85vh] my-14' : 'max-h-[62vh] scale-100 rounded-xl'
                  }`}
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/75 border border-blue-500/30 text-[11px] font-medium text-blue-300 backdrop-blur-md pointer-events-none shadow-lg">
                  {isCertZoomed === 2 ? "🔍 Click to Reset Zoom" : "🔍 Click to Zoom In (1.75x)"}
                </div>
              </div>

              {/* Credential 2 Details */}
              <div className="max-w-3xl w-full text-center mt-6 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    🏛️ Official Editorial Appointment
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Editor — Technological Advancement Society
                </h2>

                <p className="text-xs md:text-sm font-medium text-blue-400">
                  Faculty of Indigenous Health Sciences and Technology, GWUIM
                </p>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  Unanimously elected and appointed by the Dean of the Faculty as the Editor for the Academic Year 2023/2024, spearheading digital design and official media publications.
                </p>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* SLIoT Challenge Video Production Modal */}
      {isSliotModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => setIsSliotModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl overflow-y-auto p-4 md:p-10 flex flex-col items-center animate-fadeIn"
        >
          {/* Floating Top-Right Close Button */}
          <button 
            type="button"
            onClick={() => setIsSliotModalOpen(false)}
            aria-label="Close modal"
            className="fixed top-5 right-5 md:top-8 md:right-8 z-50 rounded-xl bg-slate-900/90 border border-slate-700/60 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer backdrop-blur-md shadow-2xl tracking-wider uppercase"
          >
            CLOSE ✕
          </button>

          {/* Centered Vertical Layout */}
          <div 
            className="w-full max-w-4xl flex flex-col items-center my-auto py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 16:9 Responsive Video Wrapper with Drop-Slide Animation */}
            <div 
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_25px_60px_rgba(6,182,212,0.25)] bg-black/60"
              style={{ animation: 'slideDownCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <iframe 
                src="https://drive.google.com/file/d/1rDlpb7dQS8SX3_8FXJpQgiQKRxuedmpl/preview" 
                title="SLIoT Challenge Semi-Finalist Video Submission"
                className="w-full h-full border-0" 
                allow="autoplay" 
                allowFullScreen
              />
            </div>

            {/* Compact Description Card Below Video with Delayed Fade-Up */}
            <div 
              className="max-w-3xl w-full text-center mt-8 space-y-4"
              style={{ animation: 'fadeUpDelayed 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  🏆 SLIoT Challenge — National Semi-Finalist Selection
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Innovative IoT Pitch & Demonstration Reel
              </h2>

              <p className="text-xs md:text-sm font-medium text-cyan-400">
                Sri Lanka IoT (SLIoT) Challenge — National Semi-Finals Round
              </p>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Produced for the Sri Lanka IoT (SLIoT) Challenge organized to recognize breakthrough hardware/software solutions across Sri Lankan universities.
              </p>

              {/* Creative & Production Roles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs text-left">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm">
                  <span className="font-bold text-cyan-400 block mb-1">Scriptwriting & Storyboard</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Conceptualized the technical narrative, problem statement, and dynamic solution hook to engage the national jury.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm">
                  <span className="font-bold text-cyan-400 block mb-1">Camera Direction</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Planned multi-angle camera framing, macro electronic hardware shots, and smooth visual pacing.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm">
                  <span className="font-bold text-cyan-400 block mb-1">Post-Production (CapCut)</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Kinetic typography, velocity cuts, multi-track audio mastering, and color treatment for maximal pitch impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fiverr Commercial Video Editing Gig Promo Modal */}
      {isFiverrModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => setIsFiverrModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl overflow-y-auto p-4 md:p-10 flex flex-col items-center animate-fadeIn"
        >
          {/* Floating Top-Right Close Button */}
          <button 
            type="button"
            onClick={() => setIsFiverrModalOpen(false)}
            aria-label="Close modal"
            className="fixed top-5 right-5 md:top-8 md:right-8 z-50 rounded-xl bg-slate-900/90 border border-slate-700/60 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer backdrop-blur-md shadow-2xl tracking-wider uppercase"
          >
            CLOSE ✕
          </button>

          {/* Centered Vertical Layout */}
          <div 
            className="w-full max-w-4xl flex flex-col items-center my-auto py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 16:9 Responsive Video Wrapper with Drop-Slide Animation */}
            <div 
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_25px_60px_rgba(59,130,246,0.25)] animate-in slide-in-from-top-12 duration-700 ease-out bg-black/60"
              style={{ animation: 'slideDownCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <iframe 
                src="https://drive.google.com/file/d/1a1QRabfVm3xtJ8kOeuEww2j-2l98q-mF/preview" 
                title="Fiverr Commercial Video Editing — Service Promo Reel"
                className="w-full h-full border-0" 
                allow="autoplay" 
                allowFullScreen
              />
            </div>

            {/* Compact Description Card Below Video */}
            <div 
              className="max-w-3xl w-full text-center mt-8 space-y-4"
              style={{ animation: 'fadeUpDelayed 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  🚀 Freelance Commercial Production
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                High-Retention Video Editing Service Showcase
              </h2>

              <p className="text-xs md:text-sm font-medium text-blue-400">
                High-Converting Freelance Service Showcase
              </p>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Designed as the primary video asset for a professional Fiverr gig, engineered to capture client attention and demonstrate commercial video editing capabilities.
              </p>

              {/* Complete Production Ownership */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs text-left">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm">
                  <span className="font-bold text-blue-400 block mb-1">Script & Conceptualization</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Authored the full voiceover script, marketing hooks, and call-to-action structure.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm">
                  <span className="font-bold text-blue-400 block mb-1">Visual Pacing & Editing</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Cut and timed in CapCut using velocity curves, smooth transitions, and dynamic sound effects.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/20 backdrop-blur-sm">
                  <span className="font-bold text-blue-400 block mb-1">Kinetic Motion & Assets</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Synchronized typography, graphic overlays, and commercial color grading tailored for freelance marketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MediLoop — Smart Healthcare Equipment Rental & Marketplace Platform Modal */}
      {isMediloopModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          onClick={() => setIsMediloopModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#06080F]/95 backdrop-blur-2xl overflow-y-auto p-4 md:p-10 flex flex-col items-center animate-fadeIn"
        >
          {/* Fixed Top-Right Close Button */}
          <button 
            type="button"
            onClick={() => setIsMediloopModalOpen(false)}
            aria-label="Close modal"
            className="fixed top-5 right-5 md:top-8 md:right-8 z-50 rounded-xl bg-slate-900/90 border border-emerald-500/40 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer backdrop-blur-md shadow-2xl tracking-wider uppercase"
          >
            CLOSE ✕
          </button>

          {/* Modal Container */}
          <div 
            className="w-full max-w-7xl flex flex-col items-center my-auto py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header Bar */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <span>MediLoop — UI/UX Case Study</span>
                </h3>
                <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  🏆 DHack Semi-Finalist
                </span>
              </div>
              <p className="text-xs text-emerald-400/80 font-mono tracking-wider uppercase">
                6-Screen Interactive Mobile Prototype • Figma
              </p>
            </div>

            {/* Alternating Slide-in Screen Grid (Screens 1 to 6) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-8 w-full max-w-7xl items-center justify-center">
              {[
                {
                  num: "01",
                  title: "Welcome & Onboarding",
                  tag: "Dual-Role Choice",
                  img: "/assets/projects/mediloop/ui-1.png",
                  alt: "MediLoop Welcome and Dual-Role Onboarding"
                },
                {
                  num: "02",
                  title: "Buyer Home Confirmation",
                  tag: "Account Created",
                  img: "/assets/projects/mediloop/ui-2.png",
                  alt: "MediLoop Buyer Home Confirmation Screen"
                },
                {
                  num: "03",
                  title: "Google Auth Selection",
                  tag: "One-Tap Login",
                  img: "/assets/projects/mediloop/ui-3.png",
                  alt: "MediLoop Google Account Selection Screen"
                },
                {
                  num: "04",
                  title: "Verifying Account",
                  tag: "Encrypted Security",
                  img: "/assets/projects/mediloop/ui-4.png",
                  alt: "MediLoop Verifying Account Screen"
                },
                {
                  num: "05",
                  title: "Marketplace Dashboard",
                  tag: "AI Assist & Orders",
                  img: "/assets/projects/mediloop/ui-5.png",
                  alt: "MediLoop Main Marketplace Dashboard Screen"
                },
                {
                  num: "06",
                  title: "Order & Service Alerts",
                  tag: "Live Push Tracking",
                  img: "/assets/projects/mediloop/ui-6.png",
                  alt: "MediLoop Order & Service Notifications Screen"
                }
              ].map((screen, sIdx) => {
                const isOdd = sIdx % 2 === 0; // Screen 1, 3, 5 (Odd)
                return (
                  <div
                    key={sIdx}
                    className={`flex flex-col items-center group w-full ${
                      isOdd
                        ? 'animate-in slide-in-from-top-16 duration-700 ease-out'
                        : 'animate-in slide-in-from-bottom-16 duration-700 ease-out'
                    }`}
                    style={{
                      animation: isOdd
                        ? 'slideDownCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        : 'slideUpCenter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}
                  >
                    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#090D16] border-2 border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300">
                      <img
                        src={screen.img}
                        alt={screen.alt}
                        className="w-full h-auto rounded-3xl shadow-2xl object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[11px] font-bold text-emerald-300 block tracking-tight">
                        {screen.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Screen {screen.num} • {screen.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Project Description & Case Study Stacked Underneath */}
            <div 
              className="max-w-4xl w-full text-center mt-6 space-y-4"
              style={{ animation: 'fadeIn 0.6s ease-out 0.2s backwards' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  Smart Medical Equipment • Trusted Care
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Human-Centered Healthcare Rental Experience
              </h2>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Engineered during the DHack National Hackathon, advancing into the Semi-Finals. Focused on solving urgent medical equipment scarcity for patients and caretakers.
              </p>

              {/* UX Pillars Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-left">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-emerald-400 text-sm">Onboarding & Auth (Screens 1-4)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      Frictionless dual-role registration (Rent/Buy vs Rent-Out/Sell) with one-tap Google auth and verification.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-emerald-400/80 font-mono">
                    Frictionless user acquisition
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-teal-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      <span className="font-bold text-teal-400 text-sm">Core Experience & Marketplace (Screen 5)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      High-accessibility home dashboard featuring AI equipment recommendations, live order tracking, category filters, and verified supplier trust markers.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-teal-400/80 font-mono">
                    AI recommendation engine
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="font-bold text-cyan-400 text-sm">Engagement & Tracking (Screen 6)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      Real-time push notification system with clear color-coded statuses for service approvals, delivery updates, and dispatches.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-cyan-400/80 font-mono">
                    Real-time status updates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

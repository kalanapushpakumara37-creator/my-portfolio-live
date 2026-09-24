import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Bot } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Responsive resize tracking for smooth mobile scaling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Material customization: Deep obsidian titanium body + electric cyan/blue emissive accents
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
            // Base metal: Shift to a richer deep obsidian / dark titanium tone
            mat.roughness = 0.25;
            mat.metalness = 0.85;

            const name = (mat.name || '').toLowerCase();
            const childName = (child.name || '').toLowerCase();
            const isAccent =
              name.includes('eye') ||
              name.includes('light') ||
              name.includes('glow') ||
              name.includes('accent') ||
              name.includes('cyan') ||
              name.includes('blue') ||
              childName.includes('eye') ||
              (mat.emissive && mat.emissive.getHex() > 0);

            if (isAccent) {
              // High-pop electric cyan glow
              mat.emissive = new THREE.Color('#00f0ff');
              mat.emissiveIntensity = 2.4;
              mat.color = new THREE.Color('#38bdf8');
            } else {
              // Deep obsidian metallic tone
              mat.color = new THREE.Color('#0f172a');
            }
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [scene]);

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

  // Responsive scale and position
  const modelScale = isMobile ? 0.44 : 0.56;
  const modelPosition = isMobile ? [0, -1.35, 0] : [0, -1.6, 0];

  return (
    <group ref={group} onPointerDown={handlePointerDown}>
      <primitive
        object={scene}
        scale={modelScale}
        position={modelPosition}
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

export default function RobotMascot() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[620px] mx-auto flex items-center justify-center select-none group bg-transparent"
      style={{
        perspective: '1200px'
      }}
    >
      {/* Behind the 3D robot: soft layered glow mesh (cyan-500/20 and blue-600/20) */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute inset-4 bg-gradient-to-bl from-blue-600/20 via-cyan-400/15 to-transparent blur-2xl -z-10 pointer-events-none rounded-full" />

      {/* Seamless Transparent 3D Canvas wrapper */}
      <div
        className="relative w-full h-full bg-transparent flex items-center justify-center"
        style={{
          transform: `rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
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
              dpr={[1, 1.5]}
              camera={{ position: [0, 0.2, 5.2], fov: 45 }}
              className="w-full h-full cursor-grab active:cursor-grabbing bg-transparent"
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              {/* Studio lighting: soft ambient and directional rim lights (intensity: 1.8) */}
              <ambientLight intensity={0.8} />
              <directionalLight position={[0, 4, 5]} intensity={1.4} color="#ffffff" />
              <directionalLight position={[-4, 3, -3]} intensity={1.8} color="#00f0ff" />
              <directionalLight position={[4, 2, -3]} intensity={1.8} color="#3b82f6" />
              <directionalLight position={[0, -2, 3]} intensity={0.5} color="#38bdf8" />

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
  );
}

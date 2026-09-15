"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// =============================================================================
// DevBackgroundCanvas — Developer Experience Blueprint Spotlight Canvas
// =============================================================================
// - Renders schematic wireframe blueprint (/dev-hero-section/assets/dark_background.png
//   or light_background.png) at native 1:1 unexpanded scale centered and tiled.
// - Fixed to viewport background (-z-10) for continuous scrolling sectional support.
// - Interactive radial spotlight around cursor reveals blueprint with smooth 60fps lerp.
// - Auto-detects system theme and supports data-theme overrides.
// =============================================================================

interface DevBackgroundCanvasProps {
  theme?: "dark" | "light";
  radius?: number;
  falloff?: number;
  className?: string;
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_radius;
uniform float u_falloff;
uniform vec3 u_bgColor;
uniform float u_intensity;
uniform vec2 u_texSize;
varying vec2 vUv;

void main() {
  // Keep native 1:1 scale centered on screen and stack/tile across width and height
  vec2 offsetFromCenter = gl_FragCoord.xy - (u_resolution * 0.5);
  vec2 texUv = fract((offsetFromCenter / u_texSize) + vec2(0.5, 0.5));

  // Sample blueprint texture with repeat wrapping
  vec4 texColor = texture2D(u_texture, texUv);

  // Calculate distance from cursor in viewport pixel space
  float dist = distance(gl_FragCoord.xy, u_mouse);

  // Spotlight radial mask with soft feathered falloff
  float effectiveRadius = u_radius * u_intensity;
  float innerRadius = effectiveRadius * (1.0 - u_falloff);
  float mask = 0.0;
  
  if (effectiveRadius > 0.0) {
    mask = 1.0 - smoothstep(innerRadius, effectiveRadius, dist);
  }

  // Blend solid background color into blueprint texture
  vec3 finalColor = mix(u_bgColor, texColor.rgb, mask);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function DevBackgroundCanvas({
  theme: propTheme,
  radius = 320,
  falloff = 0.55,
  className = "",
}: DevBackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [detectedTheme, setDetectedTheme] = useState<"dark" | "light">("dark");
  const activeTheme = propTheme || detectedTheme;

  // Detect system theme preference or document data-theme attribute
  useEffect(() => {
    if (typeof window === "undefined" || propTheme) return;

    const checkTheme = () => {
      const docTheme = document.documentElement.getAttribute("data-theme");
      if (docTheme === "light" || docTheme === "dark") {
        setDetectedTheme(docTheme);
        return;
      }
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      setDetectedTheme(mediaQuery.matches ? "light" : "dark");
    };

    checkTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      setDetectedTheme(e.matches ? "light" : "dark");
    };
    mediaQuery.addEventListener("change", handler);

    // Also observe attribute mutations on documentElement (for theme toggles)
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => {
      mediaQuery.removeEventListener("change", handler);
      observer.disconnect();
    };
  }, [propTheme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let animationFrameId: number;
    const isDark = activeTheme === "dark";
    const bgVec = isDark
      ? new THREE.Vector3(0.027, 0.035, 0.055) // Sleek obsidian #07090e matching terminal-core
      : new THREE.Vector3(0.973, 0.980, 0.988); // Crisp slate white #f8fafc matching terminal-core

    const texturePath = isDark
      ? "/dev-hero-section/assets/dark_background.png"
      : "/dev-hero-section/assets/light_background.png";

    // 1. Scene & Camera setup (Orthographic full-screen quad)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. Renderer setup with proper pixel ratio
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 3. Load Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath, () => {
      renderer.render(scene, camera);
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    // 4. Uniforms
    const dpr = Math.min(window.devicePixelRatio, 2);
    const uniforms = {
      u_texture: { value: texture },
      u_resolution: {
        value: new THREE.Vector2(
          container.clientWidth * dpr,
          container.clientHeight * dpr
        ),
      },
      u_mouse: {
        value: new THREE.Vector2(
          (container.clientWidth / 2) * dpr,
          (container.clientHeight / 2) * dpr
        ),
      },
      u_radius: { value: radius * dpr },
      u_falloff: { value: falloff },
      u_bgColor: { value: bgVec },
      u_intensity: { value: 0.0 }, // Smoothly fades in on interaction
      u_texSize: {
        value: new THREE.Vector2(1440.0 * dpr, 1024.0 * dpr),
      },
    };

    // 5. Geometry & Shader Material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 6. Interactive Cursor Tracking with Smooth Lerp
    let targetMouseX = container.clientWidth / 2;
    let targetMouseY = container.clientHeight / 2;
    let currentMouseX = targetMouseX;
    let currentMouseY = targetMouseY;
    let targetIntensity = 0.0;
    let currentIntensity = 0.0;

    let lastClientX = targetMouseX;
    let lastClientY = targetMouseY;

    const updatePointerPos = (clientX: number, clientY: number) => {
      lastClientX = clientX;
      lastClientY = clientY;
      const rect = container.getBoundingClientRect();
      targetMouseX = clientX - rect.left;
      targetMouseY = clientY - rect.top;

      // Reveal spotlight only when pointer is within or near the section container
      if (
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right
      ) {
        targetIntensity = 1.0;
      } else {
        targetIntensity = 0.0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
    };

    const handlePointerEnter = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      currentMouseX = targetMouseX;
      currentMouseY = targetMouseY;
      targetIntensity = 1.0;
    };

    const handlePointerLeave = () => {
      targetIntensity = 0.0; // Smooth fade out when leaving section
    };

    const handleScroll = () => {
      updatePointerPos(lastClientX, lastClientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("pointerenter", handlePointerEnter);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const currentDpr = Math.min(window.devicePixelRatio, 2);

      renderer.setPixelRatio(currentDpr);
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width * currentDpr, height * currentDpr);
      uniforms.u_texSize.value.set(1440.0 * currentDpr, 1024.0 * currentDpr);
      uniforms.u_radius.value = radius * currentDpr;
    };

    window.addEventListener("resize", handleResize);

    // 8. Animation Loop (60fps lerp)
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow
      const lerpSpeed = 0.12;
      currentMouseX += (targetMouseX - currentMouseX) * lerpSpeed;
      currentMouseY += (targetMouseY - currentMouseY) * lerpSpeed;

      // Smooth intensity fade
      currentIntensity += (targetIntensity - currentIntensity) * 0.08;

      const currentDpr = Math.min(window.devicePixelRatio, 2);
      // gl_FragCoord.y starts at bottom in WebGL, clientY starts at top
      const glMouseY = (container.clientHeight - currentMouseY) * currentDpr;
      const glMouseX = currentMouseX * currentDpr;

      uniforms.u_mouse.value.set(glMouseX, glMouseY);
      uniforms.u_intensity.value = currentIntensity;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [activeTheme, radius, falloff]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    />
  );
}

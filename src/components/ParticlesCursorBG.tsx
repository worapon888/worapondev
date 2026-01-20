"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// --- Shaders ---
const vertexShader = /* glsl */ `
  uniform vec2 uResolution;
  uniform sampler2D uPictureTexture;
  uniform sampler2D uDisplacementTexture;
  attribute float aIntensity;
  attribute float aAngle;
  varying vec3 vColor;

  void main() {
    vec3 newPosition = position;
    float displacementIntensity = texture2D(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    vec3 displacement = vec3(cos(aAngle) * 0.2, sin(aAngle) * 0.2, 1.0);
    displacement = normalize(displacement) * displacementIntensity * 3.0 * aIntensity;
    newPosition += displacement;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float pictureIntensity = pow(texture2D(uPictureTexture, uv).r, 1.6);
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y * (1.0 / -viewPosition.z);

    vColor = mix(vec3(pictureIntensity), vec3(pictureIntensity) * vec3(0.55, 1.00, 0.85), 0.75) * 0.75;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord;
    float d = length(uv - vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.35, d));
  }
`;

export default function ParticlesCursorBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let rafId: number;
    let isMounted = true;

    // 1. Setup Displacement Canvas (In-memory only)
    const disp = {
      size: 128,
      canvas: document.createElement("canvas"),
      ctx: null as CanvasRenderingContext2D | null,
      glow: new Image(),
      cursor: new THREE.Vector2(9999, 9999),
      prevCursor: new THREE.Vector2(9999, 9999),
    };
    disp.canvas.width = disp.canvas.height = disp.size;
    disp.ctx = disp.canvas.getContext("2d");
    disp.glow.src = "/about/glow.png";

    // 2. Scene Setup
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pr: Math.min(window.devicePixelRatio, 2),
    };
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(sizes.pr);
    renderer.setSize(sizes.width, sizes.height);

    const textureLoader = new THREE.TextureLoader();
    const dispTexture = new THREE.CanvasTexture(disp.canvas);
    const interactivePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial(),
    );
    interactivePlane.visible = false;
    scene.add(interactivePlane);

    // 3. Particles Geometry
    const geometry = new THREE.PlaneGeometry(7, 7, 128, 128);
    geometry.setIndex(null);
    geometry.deleteAttribute("normal");

    const count = geometry.attributes.position.count;
    const intensities = new Float32Array(count);
    const angles = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      intensities[i] = Math.random();
      angles[i] = Math.random() * Math.PI * 2;
    }
    geometry.setAttribute(
      "aIntensity",
      new THREE.BufferAttribute(intensities, 1),
    );
    geometry.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(
            sizes.width * sizes.pr,
            sizes.height * sizes.pr,
          ),
        },
        uPictureTexture: {
          value: textureLoader.load("/about/about-profile3.png"),
        },
        uDisplacementTexture: { value: dispTexture },
      },
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.y = 1;
    scene.add(particles);

    // 4. Interaction Logic
    const raycaster = new THREE.Raycaster();
    const screenCursor = new THREE.Vector2(9999, 9999);

    const handlePointerMove = (e: PointerEvent) => {
      screenCursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      screenCursor.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      material.uniforms.uResolution.value.set(
        sizes.width * sizes.pr,
        sizes.height * sizes.pr,
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    // 5. Animation Loop
    const tick = () => {
      if (!isMounted) return;

      // Update Displacement
      raycaster.setFromCamera(screenCursor, camera);
      const intersect = raycaster.intersectObject(interactivePlane);
      if (intersect.length > 0 && intersect[0].uv) {
        disp.cursor.x = intersect[0].uv.x * disp.size;
        disp.cursor.y = (1 - intersect[0].uv.y) * disp.size;
      }

      if (disp.ctx) {
        disp.ctx.globalCompositeOperation = "source-over";
        disp.ctx.globalAlpha = 0.06;
        disp.ctx.fillRect(0, 0, disp.size, disp.size);

        const dist = disp.prevCursor.distanceTo(disp.cursor);
        disp.prevCursor.copy(disp.cursor);
        const alpha = Math.min(dist * 0.05, 1);

        if (disp.glow.complete && disp.glow.naturalWidth > 0) {
          const gSize = disp.size * 0.28;
          disp.ctx.globalCompositeOperation = "lighten";
          disp.ctx.globalAlpha = 0.9 * alpha + 0.05;
          disp.ctx.drawImage(
            disp.glow,
            disp.cursor.x - gSize / 2,
            disp.cursor.y - gSize / 2,
            gSize,
            gSize,
          );
        }
      }
      dispTexture.needsUpdate = true;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    tick();

    // 6. Clean Up (Essential for Performance)
    return () => {
      isMounted = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      dispTexture.dispose();
      material.uniforms.uPictureTexture.value.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full outline-none"
    />
  );
}

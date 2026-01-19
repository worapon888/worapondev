"use client";

import { useEffect, useRef } from "react";

type DisplacementState = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  glowImage: HTMLImageElement;
  interactivePlane: import("three").Mesh<
    import("three").PlaneGeometry,
    import("three").MeshBasicMaterial
  >;
  raycaster: import("three").Raycaster;
  screenCursor: import("three").Vector2;
  canvasCursor: import("three").Vector2;
  canvasCursorPrevious: import("three").Vector2;
  texture: import("three").CanvasTexture;
};

export default function ParticlesCursorBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let disposed = false;

    const run = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/addons/controls/OrbitControls.js"
      );

      // ===== Shaders =====
      const particlesVertexShader = /* glsl */ `
        uniform vec2 uResolution;
        uniform sampler2D uPictureTexture;
        uniform sampler2D uDisplacementTexture;

        attribute float aIntensity;
        attribute float aAngle;

        varying vec3 vColor;

        void main()
        {
            vec3 newPosition = position;

            float displacementIntensity = texture2D(uDisplacementTexture, uv).r;
            displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

            vec3 displacement = vec3(
                cos(aAngle) * 0.2,
                sin(aAngle) * 0.2,
                1.0
            );
            displacement = normalize(displacement);
            displacement *= displacementIntensity;
            displacement *= 3.0;
            displacement *= aIntensity;

            newPosition += displacement;

            vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;

            float pictureIntensity = texture2D(uPictureTexture, uv).r;
            pictureIntensity = pow(pictureIntensity, 1.6);

            gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
            gl_PointSize *= (1.0 / -viewPosition.z);

            vec3 tint = vec3(0.55, 1.00, 0.85);
            vec3 base = vec3(pictureIntensity);

            float tintStrength = 0.75;
            vec3 colored = mix(base, base * tint, tintStrength);

            float gain = 0.75;
            vColor = colored * gain;
        }
      `;

      const particlesFragmentShader = /* glsl */ `
        varying vec3 vColor;

        void main()
        {
            vec2 uv = gl_PointCoord;
            float d = length(uv - vec2(0.5));
            if (d > 0.5) discard;

            float alpha = smoothstep(0.5, 0.35, d);
            gl_FragColor = vec4(vColor, alpha);
        }
      `;

      // ===== Scene =====
      const scene = new THREE.Scene();

      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      };

      const camera = new THREE.PerspectiveCamera(
        35,
        sizes.width / sizes.height,
        0.1,
        100,
      );
      camera.position.set(0, 0, 18);
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.enabled = false;

      const textureLoader = new THREE.TextureLoader();

      // ===== Displacement (typed) =====
      const dispCanvas = document.createElement("canvas");
      dispCanvas.width = 128;
      dispCanvas.height = 128;

      dispCanvas.style.position = "fixed";
      dispCanvas.style.width = "128px";
      dispCanvas.style.height = "128px";
      dispCanvas.style.top = "0";
      dispCanvas.style.left = "0";
      dispCanvas.style.zIndex = "0";
      dispCanvas.style.opacity = "0";
      dispCanvas.style.pointerEvents = "none";
      document.body.append(dispCanvas);

      const dispCtx = dispCanvas.getContext("2d");
      if (!dispCtx) {
        // กันกรณี context ไม่ได้ (rare)
        dispCanvas.remove();
        return;
      }

      dispCtx.fillStyle = "black";
      dispCtx.fillRect(0, 0, dispCanvas.width, dispCanvas.height);

      const glowImage = new Image();
      glowImage.src = "/about/glow.png";

      const interactivePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide }),
      );
      interactivePlane.visible = false;
      scene.add(interactivePlane);

      const raycaster = new THREE.Raycaster();
      const screenCursor = new THREE.Vector2(9999, 9999);
      const canvasCursor = new THREE.Vector2(9999, 9999);
      const canvasCursorPrevious = new THREE.Vector2(9999, 9999);

      const onPointerMove = (event: PointerEvent) => {
        screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
        screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
      };
      window.addEventListener("pointermove", onPointerMove);

      const dispTexture = new THREE.CanvasTexture(dispCanvas);

      const displacement: DisplacementState = {
        canvas: dispCanvas,
        context: dispCtx,
        glowImage,
        interactivePlane,
        raycaster,
        screenCursor,
        canvasCursor,
        canvasCursorPrevious,
        texture: dispTexture,
      };

      // ===== Particles =====
      const particlesGeometry = new THREE.PlaneGeometry(7, 7, 128, 128);
      particlesGeometry.setIndex(null);
      particlesGeometry.deleteAttribute("normal");

      const count = particlesGeometry.attributes.position.count;
      const intensitiesArray = new Float32Array(count);
      const anglesArray = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        intensitiesArray[i] = Math.random();
        anglesArray[i] = Math.random() * Math.PI * 2;
      }

      particlesGeometry.setAttribute(
        "aIntensity",
        new THREE.BufferAttribute(intensitiesArray, 1),
      );
      particlesGeometry.setAttribute(
        "aAngle",
        new THREE.BufferAttribute(anglesArray, 1),
      );

      const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms: {
          uResolution: new THREE.Uniform(
            new THREE.Vector2(
              sizes.width * sizes.pixelRatio,
              sizes.height * sizes.pixelRatio,
            ),
          ),
          uPictureTexture: new THREE.Uniform(
            textureLoader.load("/about/about-profile3.png"),
          ),
          uDisplacementTexture: new THREE.Uniform(displacement.texture),
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      // ✅ ดันลงล่าง (ติดลบ = ลง)
      particles.position.y = 1;

      // Resize
      const onResize = () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        particlesMaterial.uniforms.uResolution.value.set(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        );

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(sizes.pixelRatio);
      };
      window.addEventListener("resize", onResize);

      // Animate
      let raf = 0;

      const tick = () => {
        if (disposed) return;

        controls.update();

        displacement.raycaster.setFromCamera(displacement.screenCursor, camera);

        const intersections = displacement.raycaster.intersectObject(
          displacement.interactivePlane,
        );

        const hit = intersections[0];
        if (hit && hit.uv) {
          displacement.canvasCursor.x = hit.uv.x * displacement.canvas.width;
          displacement.canvasCursor.y =
            (1 - hit.uv.y) * displacement.canvas.height;
        }

        displacement.context.globalCompositeOperation = "source-over";
        displacement.context.globalAlpha = 0.06;
        displacement.context.fillRect(
          0,
          0,
          displacement.canvas.width,
          displacement.canvas.height,
        );

        const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
          displacement.canvasCursor,
        );
        displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
        const alpha = Math.min(cursorDistance * 0.05, 1);

        const glowSize = displacement.canvas.width * 0.28;
        displacement.context.globalCompositeOperation = "lighten";
        displacement.context.globalAlpha = 0.9 * alpha + 0.05;

        // กัน error ถ้า image ยังโหลดไม่เสร็จ / broken
        if (
          displacement.glowImage.complete &&
          displacement.glowImage.naturalWidth > 0
        ) {
          displacement.context.drawImage(
            displacement.glowImage,
            displacement.canvasCursor.x - glowSize * 0.5,
            displacement.canvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize,
          );
        }

        displacement.texture.needsUpdate = true;

        renderer.render(scene, camera);
        raf = window.requestAnimationFrame(tick);
      };

      tick();

      // Cleanup
      return () => {
        disposed = true;
        window.cancelAnimationFrame(raf);

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);

        controls.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();

        displacement.texture.dispose();
        displacement.canvas.remove();
      };
    };

    let cleanup: undefined | (() => void);

    run().then((fn) => {
      cleanup = fn;
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="inset-0 -z-10 h-full w-full"
      style={{ outline: "none" }}
    />
  );
}

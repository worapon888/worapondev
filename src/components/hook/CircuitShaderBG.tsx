"use client";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function CircuitTextureBG() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/texture/circuit.png");

  // ปรับให้ texture ซ้ำได้
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const uTime = useRef(0);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTex: { value: texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
uniform float uTime;
varying vec2 vUv;

  void main() {
  vec4 texColor = texture2D(uTex, vUv);

  // ปรับความสว่าง (contrast boost)
  float brightness = length(texColor.rgb);
  float glow = 0.5 + 0.5 * sin(uTime * 3.0 + vUv.y * 20.0);
  float intensity = brightness * glow * 2.0;

  // สีเขียวมรกตแบบ sci-fi
  vec3 glowColor = vec3(0.0, 1.0, 0.8) * intensity;

  gl_FragColor = vec4(glowColor, brightness * 0.5);
}

      `,
      transparent: true,
    });
  }, [texture]);

  useFrame((_, delta) => {
    uTime.current += delta;
    material.uniforms.uTime.value = uTime.current;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[30, 20]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

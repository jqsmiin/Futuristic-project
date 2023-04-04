import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import gsap from "gsap";

export function Sphere() {
  const ballRef = useRef(null);
  useEffect(() => {
    if (ballRef.current) {
      console.log(ballRef.current);

      const timeline = gsap.timeline();

      // x-axis motion
      timeline.to(ballRef.current.position, {
        x: 2,
        duration: 5,
        ease: "power2.out",
      });

      // y-axis motion
      timeline.to(
        ballRef.current.position,
        {
          y: 0.5,
          duration: 5,
          ease: "bounce.out",
        },
        "<"
      );
    }
  }, [ballRef.current]);
  return (
    <>
      <mesh position={[-3, 0, -100]} castShadow ref={ballRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={"#fff"} metalness={0.6} roughness={0.2} />
      </mesh>
    </>
  );
}

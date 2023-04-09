import {
  Float,
  PerspectiveCamera,
  Text,
  useScroll,
  Image,
  Html,
} from "@react-three/drei";
import { gsap } from "gsap";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Group } from "three";
import { Airplane } from "./Airplane";
import { Background } from "./Background";
import { Cloud } from "./Cloud";
import { Car } from "./Car";
import { Flower } from "./Flower";
import { Weapon } from "./Weapon";
import { Book } from "./Book";
import { BusStop } from "./BusStop";
import { Health } from "./Health";
import { Birds } from "./Birds";
import { PaperBird } from "./PaperBird";
import data from "./utils/Data";

const LINE_NB_POINTS = 300;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;

export const Experience = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -CURVE_DISTANCE),
        new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
        new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
        new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
        new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
        new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
        new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    const scrollOffset = Math.max(0, scroll.offset);

    const curPoint = curve.getPoint(scrollOffset);

    // Follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    // Make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(
      Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // Airplane rotation

    const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);

    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4; // stronger angle

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    // SET BACK ANGLE
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
    airplane.current.transition += 0.03;

    // Update rotation
    car.current.rotation.y += 0.03;
    flower.current.rotation.y += 0.03;
    weapon.current.rotation.y += 0.03;
    book.current.rotation.y += 0.03;
    bus.current.rotation.y += 0.03;
    health.current.rotation.y += 0.03;

    // gsap.to(paperBird.current.position, {
    //   x: paperBird.current.position.x - 0.8,
    //   y: paperBird.current.position.y - 0.4,
    //   duration: 1,
    //   repeat: 2,
    //   repeatDelay: 0.5,
    //   yoyo: true,
    // });
  });

  const airplane = useRef();
  const car = useRef();
  const flower = useRef();
  const weapon = useRef();
  const book = useRef();
  const bus = useRef();
  const health = useRef();
  const paperBird = useRef();
  const clouds = [
    // {
    //   id: 1,
    //   scale: [1, 1, 1.5],
    //   position: [-3.5, -1.2, -7],
    // },
    // {
    //   id: 2,
    //   scale: [1, 1, 2],
    //   position: [3.5, -1, -10],
    // },
    // {
    //   id: 3,
    //   scale: [1, 1, 1],
    //   position: [3.5, 0.2, -12],
    // },
    // {
    //   id: 4,
    //   scale: [0.4, 0.4, 0.4],
    //   position: [1, -0.2, -12],
    // },
    // {
    //   id: 5,
    //   scale: [0.3, 0.5, 2],
    //   position: [-4, -0.5, -53],
    // },
    {
      id: 6,
      scale: [0.8, 0.8, 0.8],
      position: [-1, -1.5, -100],
    },
    {
      id: 7,
      scale: [0.8, 0.8, 0.8],
      position: [-1, -1.5, -200],
    },
    {
      id: 8,
      scale: [0.8, 0.8, 0.8],
      position: [-16, -3, -200],
    },
    {
      id: 9,
      scale: [1, 1, 2],
      position: [-16, -3, -200],
    },
    {
      id: 10,
      scale: [1, 1, 2],
      position: [-2, -3, -300],
    },
    // {
    //   id: 10,
    //   scale: [1, 1, 2],
    //   position: [70, -2, -400],
    // },
    {
      id: 11,
      scale: [1, 1, 2],
      position: [90, -2, -500],
    },
    {
      id: 12,
      scale: [1, 1, 2],
      position: [10, -3, -600],
    },
    {
      id: 13,
      scale: [1, 1, 2],
      position: [-75, -3, -680],
    },
    {
      id: 14,
      scale: [1, 1, 2],
      position: [-90, -3, -750],
    },
    {
      id: 15,
      scale: [1, 1, 2],
      position: [-75, -3, -800],
    },
    {
      id: 16,
      scale: [1, 1, 2],
      position: [3, -3, -900],
    },
    {
      id: 17,
      scale: [1, 1, 2],
      position: [90, -1, -1000],
    },
    {
      id: 18,
      scale: [1, 1, 2],
      position: [70, -1, -1100],
    },
    {
      id: 19,
      scale: [1, 1, 2],
      position: [10, -1, -1250],
    },
    {
      id: 20,
      scale: [1, 1, 2],
      position: [-15, -3, -1400],
    },
    {
      id: 21,
      scale: [1, 1, 2],
      position: [6, -2, -1500],
    },
    {
      id: 22,
      scale: [1, 1, 2],
      position: [-6, -2, -1500],
    },
    {
      id: 23,
      scale: [1, 1, 2],
      position: [-6, -2, -1600],
    },
    {
      id: 24,
      scale: [1, 1, 2],
      position: [-6, -2, -1650],
    },
  ];

  const birds = [
    {
      id: 1,
      scale: [1.5, 1.5, 1.5],
      position: [90, 5, -400],
    },
    {
      id: 9,
      scale: [1.5, 1.5, 1.5],
      position: [90, 5, -400],
    },
    {
      id: 2,
      scale: [1.5, 1.5, 1.5],
      position: [5, 1, -600],
    },
    {
      id: 3,
      scale: [1.5, 1.5, 1.5],
      position: [15, 5, -800],
    },
    {
      id: 4,
      scale: [1.5, 1.5, 1.5],
      position: [80, 5, -1300],
    },
    {
      id: 5,
      scale: [1.5, 1.5, 1.5],
      position: [2, 5, -1600],
    },
    {
      id: 6,
      scale: [1.5, 1.5, 1.5],
      position: [5, 10, -1700],
    },
    {
      id: 7,
      scale: [5, 5, 5],
      position: [15, 10, -1800],
    },
    {
      id: 8,
      scale: [5, 5, 5],
      position: [15, 10, -1800],
    },
    {
      id: 9,
      scale: [5, 5, 5],
      position: [1, 1, -2100],
    },
    {
      id: 10,
      scale: [5, 5, 5],
      position: [1, 1, -1900],
    },
  ];

  const birdPair = [
    {
      id: 1,
      scale: [5, 5, 5],
      position: [90, -7, -500],
    },
    {
      id: 2,
      scale: [5, 5, 5],
      position: [90, -7, -700],
    },
    {
      id: 3,
      scale: [5, 5, 5],
      position: [-20, 5, -700],
    },
    {
      id: 4,
      scale: [5, 5, 5],
      position: [-20, 5, -800],
    },
    {
      id: 5,
      scale: [5, 5, 5],
      position: [-20, 5, -900],
    },
    {
      id: 6,
      scale: [5, 5, 5],
      position: [-100, 5, -800],
    },
    {
      id: 7,
      scale: [5, 5, 5],
      position: [-100, 5, -900],
    },
    {
      id: 8,
      scale: [5, 5, 5],
      position: [80, 5, -1000],
    },
    {
      id: 9,
      scale: [5, 5, 5],
      position: [80, 2, -1100],
    },
    {
      id: 9,
      scale: [5, 5, 5],
      position: [80, 5, -1200],
    },
  ];

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <directionalLight position={[0, 3, 1]} intensity={0.1} />
      {/* <OrbitControls /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane
              rotation-y={Math.PI / 2}
              scale={[0.2, 0.2, 0.2]}
              position-y={!open ? 0.1 : -0.6}
            />
          </Float>
        </group>
      </group>
      <group ref={car} position={[5, -4, -255]} scale={[0.1, 0.1, 0.1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Car rotation-y={Math.PI / 1.3} scale={[0.1, 0.1, 0.1]} />
        </Float>
      </group>
      <group ref={flower} position={[70, -4, -400]} scale={[1, 1, 1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Flower rotation-y={Math.PI / 1.3} scale={[0.4, 0.4, 0.4]} />
        </Float>
      </group>
      <group ref={weapon} position={[80, -4.3, -550]} scale={[1, 1, 1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Weapon rotation-y={Math.PI / 2} scale={[1, 1, 1]} />
        </Float>
      </group>
      <group ref={book} position={[15, -3, -900]} scale={[3, 3, 3]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Book rotation-y={Math.PI / 1.3} scale={[5, 5, 5]} />
        </Float>
      </group>
      <group ref={bus} position={[81, -3.5, -1100]} scale={[0.1, 0.1, 0.1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <BusStop rotation-y={Math.PI / 1.3} scale={[5, 5, 5]} />
        </Float>
      </group>
      <group ref={health} position={[1, -7, -1400]} scale={[0.1, 0.1, 0.1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Health rotation-y={Math.PI / 1.3} scale={[2, 2, 2]} />
        </Float>
      </group>
      <group position={[1, -7, -1800]} scale={[0.1, 0.1, 0.1]}>
        <Birds rotation-y={Math.PI / 1.3} scale={[2, 2, 2]} />
      </group>
      <group position={[1, -7, -2000]} scale={[0.1, 0.1, 0.1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Birds rotation-y={Math.PI / 1.3} scale={[2, 2, 2]} />
        </Float>
      </group>
      {/* TEXT */}
      <group position={[-3, 0, -100]}>
        <Text
          color="#000"
          anchorX={"left"}
          anchorY="middle"
          fontSize={0.22}
          maxWidth={2.5}
          font={"sans-serif"}
        >
          Welcome to the Travnik 2035!{"\n"}
          Have a seat and enjoy the ride!
        </Text>
      </group>

      {data.map((item) => {
        return (
          <group position={item.position} key={item.id}>
            {!open && (
              <>
                <Text
                  color="#000"
                  anchorX={"left"}
                  anchorY="center"
                  fontSize={0.52}
                  maxWidth={6}
                  font="sans-serif"
                >
                  {item.title}
                </Text>
                <mesh position={item.btnPosition}>
                  <group>
                    <Text
                      onClick={handleOpen}
                      color="#fff"
                      anchorX={"center"}
                      anchorY="middle"
                      fontSize={0.22}
                      maxWidth={1.4}
                      position={[0, 0, 0.05]}
                      font="sans-serif"
                    >
                      See More
                    </Text>
                    <mesh
                      position={[0, 0, 0.045]}
                      onPointerOver={(e) => e.stopPropagation()}
                    >
                      <planeBufferGeometry args={[1.5, 0.5]} />
                      <meshStandardMaterial color="#000" />
                    </mesh>
                  </group>
                </mesh>

                <Text
                  color="#000"
                  anchorX={"left"}
                  anchorY="top"
                  position-y={-0.8}
                  fontSize={0.22}
                  maxWidth={6}
                  letterSpacing={0.05}
                  font="sans-serif"
                >
                  {item.paragraph1}
                </Text>
              </>
            )}
            {open && (
              <group>
                <mesh position={item.position2}>
                  <planeBufferGeometry args={[15, 9]} />
                  <meshBasicMaterial color="#000" transparent opacity={0.9} />
                </mesh>
                <group position={item.textPosition}>
                  <Text
                    color="#fff"
                    anchorX={"left"}
                    anchorY="left"
                    fontSize={0.5}
                    maxWidth={6}
                    position={item.closePosition}
                    onClick={handleClose}
                    font="sans-serif"
                  >
                    X
                  </Text>
                  <Image
                    url={`${item.photo1}`}
                    width={5}
                    height={5}
                    scale={2}
                    anchorX={"left"}
                    anchorY="left"
                    position={[4.3, 1.5, 0.5]}
                    color={"#fff"}
                    font="sans-serif"
                  />
                  <Text
                    color="#fff"
                    anchorX={"center"}
                    anchorY="middle"
                    fontSize={0.5}
                    maxWidth={6}
                    position={[-6, 2.2, 0.1]}
                    font="sans-serif"
                  >
                    {item.title}
                  </Text>
                  <Text
                    color="#fff"
                    anchorX={"center"}
                    anchorY="middle"
                    fontSize={0.23}
                    maxWidth={10}
                    font="sans-serif"
                    position={[-2, 1, 0.1]}
                  >
                    {item.paragraph1}
                  </Text>
                  <Text
                    color="#fff"
                    anchorX={"center"}
                    anchorY="middle"
                    fontSize={0.23}
                    maxWidth={10}
                    position={[1, -1.5, 1]}
                    font="sans-serif"
                  >
                    {item.paragraph2}
                  </Text>
                  <Image
                    url={`${item.photo2}`}
                    width={5}
                    height={5}
                    scale={2}
                    anchorX={"left"}
                    anchorY="left"
                    position={[-5.5, -1.5, 0.5]}
                    color={"#fff"}
                  />
                  <group position={item.imagePosition}>
                    <Image
                      url={`${item.photo3}`}
                      width={5}
                      height={5}
                      scale={2}
                      anchorX={"left"}
                      anchorY="left"
                      position={[-5, -1.5, 0.5]}
                      color={"#fff"}
                    />
                    <Image
                      url={`${item.photo4}`}
                      width={5}
                      height={5}
                      scale={2}
                      anchorX={"left"}
                      anchorY="left"
                      position={[-1, -1.5, 0.5]}
                      color={"#fff"}
                    />
                    <Image
                      url={`${item.photo5}`}
                      width={5}
                      height={5}
                      scale={2}
                      anchorX={"left"}
                      anchorY="left"
                      position={[3, -1.5, 0.5]}
                      color={"#fff"}
                    />
                  </group>
                </group>
              </group>
            )}
          </group>
        );
      })}

      <group position={[1, 0, -1750]}>
        <Text
          color="#000"
          anchorX={"left"}
          anchorY="middle"
          fontSize={0.22}
          maxWidth={2.5}
          font={"sans-serif"}
        >
          Thank you for being a part of this journey. This was our vision of the
          future for Travnik in 2035.
        </Text>
      </group>

      {/* LINE */}
      <group position-y={-3}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"white"}
            opacity={1}
            transparent
            envMapIntensity={2}
          />
        </mesh>
      </group>

      {/* CLOUDS */}
      {clouds.map((cloud) => {
        return (
          <>
            {" "}
            <Cloud
              key={cloud.id}
              scale={cloud.scale}
              position={cloud.position}
            />{" "}
          </>
        );
      })}

      {birds.map((bird) => (
        <Float rotationIntensity={0.5}>
          <Birds key={bird.id} scale={bird.scale} position={bird.position} />
        </Float>
      ))}

      {birdPair.map((bird) => (
        <Float rotationIntensity={0.5}>
          <PaperBird
            key={bird.id}
            scale={bird.scale}
            position={bird.position}
            rotation-y={Math.PI / 1.3}
            rotation-x={Math.PI / 0.5}
          />
        </Float>
      ))}
    </>
  );
};

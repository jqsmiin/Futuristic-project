import {
  Float,
  PerspectiveCamera,
  Text,
  useScroll,
  Image,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
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
import img1 from "../photos/slika1.jpg";

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

    // Update rotation
    car.current.rotation.y += 0.03;
    flower.current.rotation.y += 0.03;
    weapon.current.rotation.y += 0.03;
    book.current.rotation.y += 0.03;
    bus.current.rotation.y += 0.03;
    health.current.rotation.y += 0.03;
  });

  const airplane = useRef();
  const car = useRef();
  const flower = useRef();
  const weapon = useRef();
  const book = useRef();
  const bus = useRef();
  const health = useRef();
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
      position: [3, -3, -1400],
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
              position-y={0.1}
            />
          </Float>
        </group>
      </group>
      <group ref={car} position={[5, -3.5, -255]} scale={[0.1, 0.1, 0.1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Car rotation-y={Math.PI / 1.3} scale={[0.1, 0.1, 0.1]} />
        </Float>
      </group>
      <group ref={flower} position={[70, -4, -400]} scale={[1, 1, 1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Flower rotation-y={Math.PI / 1.3} scale={[0.4, 0.4, 0.4]} />
        </Float>
      </group>
      <group ref={weapon} position={[26, -4.3, -600]} scale={[1, 1, 1]}>
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
      <group ref={health} position={[-3.7, -5, -1400]} scale={[0.1, 0.1, 0.1]}>
        <Float floatIntensity={2} speed={1.5} rotationIntensity={0.5}>
          <Health rotation-y={Math.PI / 1.3} scale={[2, 2, 2]} />
        </Float>
      </group>
      {/* TEXT */}
      <group position={[-3, 0, -100]}>
        <Image
          url={`${img1}`}
          width={2}
          height={2}
          anchorX={"left"}
          anchorY="left"
          position={[-4, 0, 0]}
        />
        <Text
          color="#000"
          anchorX={"left"}
          anchorY="middle"
          fontSize={0.22}
          maxWidth={2.5}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Welcome to the Travnik 2035!{"\n"}
          Have a seat and enjoy the ride!
        </Text>
      </group>

      <group position={[4, 1, -260]}>
        <Text
          color="#000"
          anchorX={"left"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Innovation
        </Text>
        <Text
          color="#000"
          anchorX={"left"}
          anchorY="top"
          position-y={-0.8}
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Travnik is set to become a hub for technological innovation and
          entrepreneurship, with a thriving startup scene and cutting-edge
          research facilities. New technologies like blockchain, artificial
          intelligence, and 3D printing will be at the forefront of this
          innovation, driving economic growth and creating new opportunities for
          businesses and individuals alike.
        </Text>
      </group>

      <group position={[75, 1, -400]}>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={6}
          position-y={1}
          position-x={-2.8}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Sustainability
        </Text>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="top"
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Travnik will have transformed into a sustainable, green city with a
          strong focus on environmental conservation and renewable energy. With
          a variety of green initiatives and policies in place, the city will be
          a leader in the fight against climate change, and a model for other
          cities around the world.
        </Text>
      </group>

      <group position={[30, 1, -600]}>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={2.5}
          position-x={-4.2}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Culture
        </Text>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="top"
          position-y={-0.8}
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Travnik's cultural scene is more vibrant than ever, with a diverse
          range of festivals, events, and artistic endeavors taking place
          throughout the city. The city's rich history and cultural heritage
          will continue to inspire new forms of artistic expression, and draw
          visitors from around the world to experience the unique and vibrant
          culture of Travnik.
        </Text>
      </group>

      <group position={[19, 1, -900]}>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={2.5}
          position-x={-3.7}
          font={"./fonts/DMSerifDisplay-Regular.ttf"}
        >
          Education
        </Text>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="top"
          position-y={-0.8}
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          As a center for education and innovation, Travnik have a highly
          skilled and educated workforce, with a strong emphasis on lifelong
          learning and professional development. The city is home to a variety
          of world-class educational institutions, from primary schools to
          universities, and offers a wealth of opportunities for students and
          professionals to grow and succeed in their chosen fields.
        </Text>
      </group>

      <group position={[85, 1, -1100]}>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={2.5}
          position-x={-4.1}
          font={"./fonts/DMSerifDisplay-Regular.ttf"}
        >
          Mobility
        </Text>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="top"
          position-y={-0.8}
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          With a focus on connectivity and mobility, Travnik have a highly
          efficient and integrated transportation network that makes it easy for
          residents and visitors to get around the city. This includes a variety
          of transportation options, from electric vehicles and public transit
          to bike-sharing and pedestrian-friendly infrastructure, making it easy
          for people to travel safely and sustainably throughout the city.
        </Text>
      </group>

      <group position={[3, 1, -1400]}>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="center"
          fontSize={0.52}
          position-x={-1.4}
          maxWidth={5}
          font={"./fonts/DMSerifDisplay-Regular.ttf"}
        >
          Health and Wellness
        </Text>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="top"
          position-y={-0.8}
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Travnik is a leader in promoting health and wellness for its
          residents. The city is home to a variety of world-class healthcare
          facilities, including hospitals, clinics, and research centers, as
          well as a wide range of fitness and wellness centers. With a strong
          focus on preventative care and healthy living, residents of Travnik
          enjoy longer, healthier lives and a higher quality of life.
        </Text>
      </group>
      <group position={[7.5, 1, -1600]}>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="center"
          fontSize={0.52}
          maxWidth={2.5}
          position-x={-3.6}
          font={"./fonts/DMSerifDisplay-Regular.ttf"}
        >
          Thank you
        </Text>
        <Text
          color="#000"
          anchorX={"right"}
          anchorY="top"
          position-y={-0.8}
          fontSize={0.22}
          maxWidth={6}
          font={"./fonts/Inter-Regular.ttf"}
        >
          Thank you for joining us on this journey through Travnik in 2035. We
          hope you enjoyed experiencing the innovative technology, sustainable
          practices, rich culture, top-tier education, efficient mobility, and
          focus on wellness and tourism that this futuristic city has to offer.
        </Text>
      </group>

      {/* LINE */}
      <group position-y={-2}>
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
    </>
  );
};

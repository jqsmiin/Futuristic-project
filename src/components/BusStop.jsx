/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 public/models/bus_stop/bus_stop.glb
Author: SCADL & Co (https://sketchfab.com/scadl)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/bus-stop-f4c1ed54bd49456ab63e4a34b2ffc85e
Title: Bus Stop
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function BusStop(props) {
  const { nodes, materials } = useGLTF("./models/bus_stop/bus_stop.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.FrontColor}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.MatGlassTP}
        />
      </group>
      <mesh
        geometry={nodes.Object_7.geometry}
        material={materials.Pavement}
        position={[0, 0, -0.01]}
      />
    </group>
  );
}

useGLTF.preload("./models/bus_stop/bus_stop.glb");

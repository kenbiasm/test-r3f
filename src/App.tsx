import './App.css'
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {  OrbitControls } from '@react-three/drei'

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const runnerTexture = useLoader(TextureLoader, 'run.png')
  console.log(runnerTexture);
  
  useFrame((state, delta) => (mesh.current.rotation.y += 0.01));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

const numTiles = 10
const tileDispDuration = 75
function Plane(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);
  const runnerTexture = useLoader(TextureLoader, 'run.png')
  useEffect(()=>{
    runnerTexture.repeat.set( 1 / numTiles, 1 );
  },[runnerTexture])
  
  useFrame(({clock}) => {
    runnerTexture.offset.x = Math.round( clock.getElapsedTime() * 1000 / tileDispDuration) % numTiles / numTiles
  });

  useFrame((state, delta) => (mesh.current.rotation.y += 0.01));


  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <planeGeometry args={[2, 2, 1, 1]} />
      <meshBasicMaterial map={runnerTexture} side={THREE.DoubleSide} />
    </mesh>
  );
}


function App() {
  return (
    <Canvas>
      <OrbitControls/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Plane position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}

export default App;

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface AvatarModelProps {
  skinColor: string;
  outfit: string;
  hat: string;
  glasses: string;
}

const AvatarModel = ({ skinColor, outfit, hat, glasses }: AvatarModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const skinColorHex = skinColor === "default" ? "#e0a899" : 
    skinColor === "tan" ? "#c68642" : 
    skinColor === "dark" ? "#8d5524" : "#ffdbac";

  const outfitColor = outfit === "blue" ? "#3b82f6" :
    outfit === "red" ? "#ef4444" :
    outfit === "green" ? "#22c55e" :
    outfit === "gold" ? "#eab308" : "#6b7280";

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={skinColorHex} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -0.3, 0]}>
        <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.15, -0.3, 0]}>
        <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 1.25, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.1, 1.25, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 1.1, 0.32]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Hat */}
      {hat !== "none" && (
        <group position={[0, 1.55, 0]}>
          {hat === "cap" && (
            <>
              <mesh>
                <cylinderGeometry args={[0.25, 0.3, 0.15, 32]} />
                <meshStandardMaterial color="#1e40af" />
              </mesh>
              <mesh position={[0, -0.05, 0.25]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[0.4, 0.02, 0.2]} />
                <meshStandardMaterial color="#1e40af" />
              </mesh>
            </>
          )}
          {hat === "wizard" && (
            <mesh rotation={[0, 0, 0]}>
              <coneGeometry args={[0.25, 0.5, 32]} />
              <meshStandardMaterial color="#7c3aed" />
            </mesh>
          )}
          {hat === "crown" && (
            <mesh>
              <cylinderGeometry args={[0.2, 0.25, 0.15, 5]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>
      )}

      {/* Glasses */}
      {glasses !== "none" && (
        <group position={[0, 1.25, 0.32]}>
          {glasses === "round" && (
            <>
              <mesh position={[-0.1, 0, 0]}>
                <torusGeometry args={[0.08, 0.01, 8, 32]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[0.1, 0, 0]}>
                <torusGeometry args={[0.08, 0.01, 8, 32]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.01, 0.01]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            </>
          )}
          {glasses === "shades" && (
            <>
              <mesh position={[-0.1, 0, 0]}>
                <boxGeometry args={[0.15, 0.08, 0.02]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[0.1, 0, 0]}>
                <boxGeometry args={[0.15, 0.08, 0.02]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.05, 0.02, 0.01]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            </>
          )}
        </group>
      )}
    </group>
  );
};

interface Avatar3DProps {
  skinColor?: string;
  outfit?: string;
  hat?: string;
  glasses?: string;
}

export const Avatar3D = ({ 
  skinColor = "default", 
  outfit = "blue", 
  hat = "none", 
  glasses = "none" 
}: Avatar3DProps) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AvatarModel 
          skinColor={skinColor} 
          outfit={outfit} 
          hat={hat} 
          glasses={glasses} 
        />
        
        <ContactShadows 
          position={[0, -0.8, 0]} 
          opacity={0.4} 
          scale={3} 
          blur={2} 
        />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

// Procedural world assets adapted from the approved natural miniature-world art study.
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "./store";
import type { Kind } from "./world";
import { Line } from "@react-three/drei";

type V3 = [number, number, number];
type Instance = { p: V3; s: V3; r?: V3; c: string };
const random = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

function surface(
  kind: "grass" | "stone" | "cliff" | "plaster" | "roof" | "wood",
) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const rand = random(713);
  const bases = {
    grass: [111, 135, 63],
    stone: [131, 132, 123],
    cliff: [178, 181, 168],
    plaster: [227, 215, 187],
    roof: [156, 79, 52],
    wood: [119, 91, 60],
  };
  const base = bases[kind];
  const pixels = ctx.createImageData(512, 512);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const grain = (rand() - 0.5) * (kind === "grass" ? 31 : 25);
    for (let c = 0; c < 3; c++) pixels.data[i + c] = base[c] + grain;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  if (kind === "grass")
    for (let i = 0; i < 16000; i++) {
      const x = rand() * 512,
        y = rand() * 512;
      ctx.strokeStyle = ["#bdd38655", "#465d2655", "#d5c99166", "#78934588"][
        i % 4
      ];
      ctx.lineWidth = 0.5 + rand();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + rand() * 5 - 2.5, y - rand() * 7);
      ctx.stroke();
    }
  if (kind === "stone") {
    for (let y = 0; y < 512; y += 48)
      for (let x = -80; x < 512; x += 100) {
        const ox = x + ((y / 48) % 2) * 50;
        ctx.strokeStyle = "#4d554c66";
        ctx.lineWidth = 3;
        ctx.strokeRect(ox + 2, y + 2, 96, 43);
        ctx.fillStyle = `rgba(220,216,195,${rand() * 0.16})`;
        ctx.fillRect(ox + 4, y + 4, 92, 39);
      }
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = "#e9e5cb18";
      ctx.fillRect(rand() * 512, rand() * 512, rand() * 9, 1);
    }
  }
  if (kind === "cliff") {
    for (let i = 0; i < 190; i++) {
      const x = rand() * 512,
        y = rand() * 512;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let j = 0; j < 6; j++)
        ctx.lineTo(x + j * (8 + rand() * 12), y + rand() * 9 - 4);
      ctx.strokeStyle = i % 3 ? "#46554e33" : "#eee3b344";
      ctx.lineWidth = 0.7 + rand() * 2;
      ctx.stroke();
    }
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = i % 3 ? "#5a6d4530" : "#d6cca846";
      ctx.beginPath();
      ctx.ellipse(
        rand() * 512,
        rand() * 512,
        rand() * 12,
        rand() * 7,
        rand() * 6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  if (kind === "roof")
    for (let y = -48; y < 512; y += 64)
      for (let x = 0; x < 512; x += 64) {
        ctx.fillStyle = `rgba(${rand() > 0.5 ? "230,150,95" : "68,39,29"},${0.08 + rand() * 0.2})`;
        ctx.fillRect(x + 1, y + 1, 62, 63);
        ctx.strokeStyle = "#5e382d88";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 60);
        ctx.quadraticCurveTo(x + 32, y + 75, x + 64, y + 60);
        ctx.stroke();
        ctx.strokeStyle = "#e9ac7b77";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 3);
        ctx.lineTo(x + 8, y + 54);
        ctx.stroke();
      }
  if (kind === "wood")
    for (let i = 0; i < 250; i++) {
      const x = rand() * 512;
      ctx.strokeStyle = i % 3 ? "#3c2b1f44" : "#edc38a44";
      ctx.lineWidth = 0.5 + rand() * 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y < 530; y += 32)
        ctx.lineTo(x + Math.sin(y * 0.023 + x) * 3, y);
      ctx.stroke();
    }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}
export const surfaces = {
  grass: surface("grass"),
  stone: surface("stone"),
  cliff: surface("cliff"),
  plaster: surface("plaster"),
  roof: surface("roof"),
  wood: surface("wood"),
};
const leaf = new THREE.BufferGeometry();
leaf.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    [0, 0, 0, -0.38, 0.12, 0.42, 0, 0.22, 1, 0.38, 0.12, 0.42],
    3,
  ),
);
leaf.setIndex([0, 1, 2, 0, 2, 3]);
leaf.computeVertexNormals();
const blade = new THREE.BufferGeometry();
blade.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    [-0.03, 0, 0, 0.03, 0, 0, 0.025, 0.6, 0.06, 0.09, 1, 0.14],
    3,
  ),
);
blade.setIndex([0, 1, 2, 0, 2, 3]);
blade.computeVertexNormals();
const rock = new THREE.IcosahedronGeometry(1, 2);
const rockPositions = rock.attributes.position;
for (let i = 0; i < rockPositions.count; i++) {
  const x = rockPositions.getX(i),
    y = rockPositions.getY(i),
    z = rockPositions.getZ(i);
  const n = 1 + Math.sin(x * 9 + y * 7) * Math.cos(z * 8) * 0.12;
  rockPositions.setXYZ(i, x * n, y * n, z * n);
}
rock.computeVertexNormals();

function Scatter({
  instances,
  geometry,
  roughness = 1,
  map,
  receiveShadow = true,
}: {
  instances: Instance[];
  geometry: THREE.BufferGeometry;
  roughness?: number;
  map?: THREE.Texture;
  receiveShadow?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    instances.forEach((instance, i) => {
      dummy.position.set(...instance.p);
      dummy.scale.set(...instance.s);
      dummy.rotation.set(...(instance.r ?? [0, 0, 0]));
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      ref.current!.setColorAt(i, color.set(instance.c));
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    if (ref.current!.instanceColor)
      ref.current!.instanceColor.needsUpdate = true;
  }, [instances]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, instances.length]}
      castShadow
      receiveShadow={receiveShadow}
    >
      <meshStandardMaterial
        roughness={roughness}
        map={map}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

const branchGeometry = new THREE.CylinderGeometry(0.38, 1, 1, 9);
function branch(start: V3, end: V3, radius: number): Instance {
  const a = new THREE.Vector3(...start),
    b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  const e = new THREE.Euler().setFromQuaternion(q);
  return {
    p: a.add(b).multiplyScalar(0.5).toArray() as V3,
    s: [radius, direction.length(), radius],
    r: [e.x, e.y, e.z],
    c: "#817661",
  };
}

export function NaturalTree({ seed }: { seed: number }) {
  const canopy = useRef<THREE.Group>(null);
  const weather = useGame((s) => s.viewWeather);
  useFrame(({ clock }) => {
    if (canopy.current)
      canopy.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.75 + seed) *
        (["rainy", "cloudy"].includes(weather) ? 0.025 : 0.012);
  });
  const rand = useMemo(() => random(seed * 123 + 19), [seed]);
  const cherry = seed % 5 === 4;
  const clusters = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = i * 2.399;
        const r = 0.25 + rand() * 0.57;
        return [Math.cos(a) * r, 1.6 + rand() * 1.1, Math.sin(a) * r] as V3;
      }),
    [rand],
  );
  const leaves = useMemo(() => {
    const rnd = random(seed * 49 + 20);
    const greens = cherry
      ? ["#dba4a0", "#d48f92", "#eab8ae", "#b16f80", "#e5b9a2", "#657840"]
      : ["#3f632f", "#66893c", "#7d9b44", "#4b7435", "#99ad57", "#849b4c"];
    return Array.from({ length: 1700 }, () => {
      const center = clusters[Math.floor(rnd() * clusters.length)];
      const a = rnd() * Math.PI * 2,
        y = rnd() * 2 - 1,
        r = Math.cbrt(rnd());
      const s = 0.09 + rnd() * 0.09;
      return {
        p: [
          center[0] + Math.cos(a) * Math.sqrt(1 - y * y) * r * 0.51,
          center[1] + y * r * 0.49,
          center[2] + Math.sin(a) * Math.sqrt(1 - y * y) * r * 0.5,
        ] as V3,
        s: [s, s, s] as V3,
        r: [rnd() * 3, rnd() * 6.28, rnd() * 3] as V3,
        c: greens[Math.floor(rnd() * greens.length)],
      };
    });
  }, [seed, clusters, cherry]);
  const branches = useMemo(
    () => [
      branch([0, 0, 0], [0.02, 1.9, -0.03], 0.115),
      ...clusters.map((p, i) =>
        branch([0, 0.6 + (i % 4) * 0.21, 0], p, 0.035 + (i % 3) * 0.009),
      ),
      ...[0, 1, 2, 3].map((i) =>
        branch(
          [Math.cos(i * 1.57) * 0.3, 0.015, Math.sin(i * 1.57) * 0.3],
          [0, 0.3, 0],
          0.045,
        ),
      ),
    ],
    [clusters],
  );
  return (
    <group ref={canopy} scale={[1, 1 + (seed % 3) * 0.07, 1]}>
      <Scatter
        instances={branches}
        geometry={branchGeometry}
        map={surfaces.wood}
      />
      <Scatter instances={leaves} geometry={leaf} receiveShadow={false} />
    </group>
  );
}

export function NaturalCottage() {
  const night = useGame((s) => s.viewHour > 19 || s.viewHour < 6);
  const gable = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.74, 1.25);
    shape.lineTo(0.74, 1.25);
    shape.lineTo(0, 1.8);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 1.3,
      bevelEnabled: false,
    });
  }, []);
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[1.64, 0.24, 1.47]} />
        <meshStandardMaterial
          map={surfaces.stone}
          color="#b8b2a2"
          bumpMap={surfaces.stone}
          bumpScale={0.025}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[1.48, 1.1, 1.3]} />
        <meshStandardMaterial
          map={surfaces.plaster}
          roughness={0.96}
          bumpMap={surfaces.plaster}
          bumpScale={0.018}
        />
      </mesh>
      <mesh castShadow position={[0, 0, -0.65]} geometry={gable}>
        <meshStandardMaterial map={surfaces.plaster} />
      </mesh>
      {/* Gabled terracotta roof: visible tile courses, ridge caps, timber fascia. */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.47, 1.53, 0]}
          rotation={[0, 0, side * -0.57]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.16, 0.085, 1.78]} />
            <meshStandardMaterial
              map={surfaces.roof}
              roughness={0.88}
              bumpMap={surfaces.roof}
              bumpScale={0.035}
            />
          </mesh>
          {[-0.89, 0.89].map((z) => (
            <mesh key={z} position={[0, -0.045, z]}>
              <boxGeometry args={[1.2, 0.11, 0.065]} />
              <meshStandardMaterial map={surfaces.wood} color="#84715a" />
            </mesh>
          ))}
        </group>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          castShadow
          position={[0, 1.868, -0.8 + i * 0.145]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry
            args={[0.08, 0.08, 0.145, 8, 1, false, 0, Math.PI]}
          />
          <meshStandardMaterial
            color={i % 3 ? "#b47755" : "#ac6e4d"}
            roughness={0.9}
          />
        </mesh>
      ))}
      <mesh castShadow position={[0.45, 1.75, -0.36]}>
        <boxGeometry args={[0.24, 0.87, 0.27]} />
        <meshStandardMaterial
          map={surfaces.stone}
          color="#b5a491"
          bumpMap={surfaces.stone}
          bumpScale={0.04}
        />
      </mesh>
      <mesh castShadow position={[0.45, 2.2, -0.36]}>
        <boxGeometry args={[0.32, 0.085, 0.35]} />
        <meshStandardMaterial color="#8b7e6d" />
      </mesh>
      <mesh position={[0.45, 2.245, -0.36]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 0.17]} />
        <meshStandardMaterial color="#3f382e" />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} castShadow position={[x, 0.76, 0.663]}>
          <boxGeometry args={[0.065, 1.13, 0.075]} />
          <meshStandardMaterial map={surfaces.wood} color="#807254" />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.27, 0.665]}>
        <boxGeometry args={[1.5, 0.07, 0.07]} />
        <meshStandardMaterial map={surfaces.wood} color="#837358" />
      </mesh>
      <mesh castShadow position={[0, 0.46, 0.675]}>
        <boxGeometry args={[0.36, 0.74, 0.065]} />
        <meshStandardMaterial
          map={surfaces.wood}
          color="#73847b"
          bumpMap={surfaces.wood}
          bumpScale={0.025}
        />
      </mesh>
      <mesh position={[0.115, 0.46, 0.718]}>
        <sphereGeometry args={[0.022, 8, 6]} />
        <meshStandardMaterial
          color="#bc9a4d"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <group key={x} position={[x, 0.82, 0.69]}>
          <mesh>
            <boxGeometry args={[0.31, 0.4, 0.055]} />
            <meshStandardMaterial color="#e8dbc0" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.25, 0.33]} />
            <meshStandardMaterial
              color={night ? "#edc57f" : "#5e7d7a"}
              emissive="#ffc06d"
              emissiveIntensity={night ? 1 : 0}
              roughness={0.18}
              metalness={0.3}
            />
          </mesh>
          {[0, 1].map((i) => (
            <mesh
              key={i}
              position={[0, 0, 0.045]}
              rotation={[0, 0, (i * Math.PI) / 2]}
            >
              <boxGeometry args={[0.023, 0.34, 0.025]} />
              <meshStandardMaterial color="#e7dcc7" />
            </mesh>
          ))}
          {[-0.21, 0.21].map((ox) => (
            <mesh key={ox} castShadow position={[ox, 0, 0]}>
              <boxGeometry args={[0.105, 0.4, 0.035]} />
              <meshStandardMaterial map={surfaces.wood} color="#8b9e8a" />
            </mesh>
          ))}
          <mesh castShadow position={[0, -0.25, 0.07]}>
            <boxGeometry args={[0.42, 0.13, 0.18]} />
            <meshStandardMaterial map={surfaces.wood} color="#796047" />
          </mesh>
          <group position={[0, -0.22, 0.08]} scale={[0.55, 0.55, 0.55]}>
            <NaturalFlowers />
          </group>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          receiveShadow
          position={[0, 0.105 - i * 0.033, 0.82 + i * 0.14]}
        >
          <boxGeometry args={[0.54 + i * 0.1, 0.09, 0.25]} />
          <meshStandardMaterial map={surfaces.stone} color="#c0b7a0" />
        </mesh>
      ))}
    </group>
  );
}

const petalGeometry = new THREE.SphereGeometry(1, 6, 4);
const stemGeometry = new THREE.CylinderGeometry(0.008, 0.012, 1, 4);
export function NaturalFlowers() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current)
      group.current.rotation.z = Math.sin(clock.elapsedTime * 1.4) * 0.025;
  });
  const parts = useMemo(() => {
    const petals: Instance[] = [],
      stems: Instance[] = [],
      leaves: Instance[] = [];
    for (let i = 0; i < 11; i++) {
      const a = i * 2.399,
        r = Math.sqrt(i / 11) * 0.38,
        h = 0.17 + (i % 4) * 0.06,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r;
      stems.push({ p: [x, h / 2, z], s: [1, h, 1], c: "#526d32" });
      leaves.push({
        p: [x + 0.03, h * 0.48, z],
        s: [0.07, 0.07, 0.13],
        r: [0.4, 0, -0.9],
        c: "#65803d",
      });
      for (let n = 0; n < 5; n++)
        petals.push({
          p: [
            x + Math.cos(n * 1.256) * 0.049,
            h,
            z + Math.sin(n * 1.256) * 0.049,
          ],
          s: [0.048, 0.015, 0.032],
          r: [0, -n * 1.256, 0],
          c: ["#edb548", "#c77b93", "#eee1b7", "#a095b8"][i % 4],
        });
      petals.push({
        p: [x, h + 0.018, z],
        s: [0.021, 0.021, 0.021],
        c: "#c59938",
      });
    }
    return { petals, stems, leaves };
  }, []);
  return (
    <group ref={group}>
      <Scatter instances={parts.petals} geometry={petalGeometry} />
      <Scatter instances={parts.stems} geometry={stemGeometry} />
      <Scatter instances={parts.leaves} geometry={leaf} />
    </group>
  );
}
export function NaturalRock({ seed = 1 }: { seed?: number }) {
  return (
    <mesh
      geometry={rock}
      castShadow
      receiveShadow
      position={[0, 0.16, 0]}
      scale={[0.48, 0.32, 0.39]}
      rotation={[0.2, seed, 0.08]}
    >
      <meshStandardMaterial
        map={surfaces.cliff}
        color="#a5a89c"
        bumpMap={surfaces.cliff}
        bumpScale={0.055}
        roughness={1}
      />
    </mesh>
  );
}

export function NaturalPond() {
  const ripple = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ripple.current)
      ripple.current.children.forEach((child, i) => {
        const phase = (clock.elapsedTime * 0.25 + i / 4) % 1;
        child.scale.set(phase * 1.25 + 0.15, (phase * 1.25 + 0.15) * 0.65, 1);
        (
          child as THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>
        ).material.opacity = (1 - phase) * 0.3;
      });
  });
  const rim = useMemo(() => {
    const rnd = random(86);
    return Array.from({ length: 25 }, (_, i) => {
      const a = (i / 25) * Math.PI * 2;
      return {
        p: [Math.cos(a) * 1.02, 0.065, Math.sin(a) * 0.72] as V3,
        s: [
          0.13 + rnd() * 0.09,
          0.09 + rnd() * 0.05,
          0.12 + rnd() * 0.07,
        ] as V3,
        r: [0, a, 0.2] as V3,
        c: ["#b4b5a0", "#989e86", "#c1bca6"][i % 3],
      };
    });
  }, []);
  return (
    <group>
      <mesh position={[0, 0.02, 0]} scale={[1.14, 1, 0.8]}>
        <cylinderGeometry args={[1, 1.08, 0.05, 48]} />
        <meshStandardMaterial color="#658353" map={surfaces.grass} />
      </mesh>
      <mesh position={[0, 0.06, 0]} scale={[1, 1, 0.7]}>
        <cylinderGeometry args={[0.96, 0.96, 0.035, 64]} />
        <meshPhysicalMaterial
          color="#4c9b9c"
          roughness={0.15}
          metalness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transparent
          opacity={0.87}
        />
      </mesh>
      <Scatter instances={rim} geometry={rock} map={surfaces.cliff} />
      <group ref={ripple}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, i * 0.7]}
            position={[-0.21, 0.087 + i * 0.0005, 0.06]}
            scale={[1, 0.65, 1]}
          >
            <ringGeometry args={[0.14 + i * 0.15, 0.145 + i * 0.15, 64]} />
            <meshBasicMaterial
              color="#d4ede0"
              transparent
              opacity={0.12 - i * 0.02}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0.35 + i * 0.13, 0.091, -0.12 + (i % 2) * 0.15]}
          rotation={[-Math.PI / 2, 0, i]}
        >
          <circleGeometry args={[0.09 + i * 0.015, 18, 0.18, 5.9]} />
          <meshStandardMaterial
            color={["#6d8e3b", "#799940", "#57823f"][i]}
            roughness={0.5}
          />
        </mesh>
      ))}
      <group position={[-0.85, 0, -0.4]} scale={[0.6, 0.9, 0.6]}>
        <NaturalFlowers />
      </group>
    </group>
  );
}

export function edgeRadius(a: number, radius: number) {
  return (
    radius *
    (1 +
      Math.sin(a * 3 + 1) * 0.035 +
      Math.cos(a * 7) * 0.025 +
      Math.sin(a * 11) * 0.015)
  );
}
export function groundGeometry(radius: number) {
  const positions: number[] = [0, 0, 0],
    uv: number[] = [0.5, 0.5],
    indices: number[] = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2,
      r = edgeRadius(a, radius);
    positions.push(Math.cos(a) * r, 0, Math.sin(a) * r);
    uv.push(
      0.5 + ((Math.cos(a) * r) / radius) * 1.4,
      0.5 + ((Math.sin(a) * r) / radius) * 1.4,
    );
    if (i < 96) indices.push(0, i + 2, i + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export function NaturalCliff({
  radius,
  depth,
}: {
  radius: number;
  depth: number;
}) {
  const geometry = useMemo(() => {
    const positions: number[] = [],
      colors: number[] = [],
      uv: number[] = [],
      indices: number[] = [];
    const levels = [1, 1.01, 0.98, 0.9, 0.86, 0.68, 0.63, 0.42, 0.25, 0.06];
    const color = new THREE.Color();
    for (let j = 0; j < levels.length; j++)
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2,
          t = j / (levels.length - 1);
        const r =
          edgeRadius(a, radius) *
          levels[j] *
          (1 + (j ? Math.sin(a * 15 + j * 1.7) * 0.055 : 0));
        positions.push(
          Math.cos(a) * r + t * 0.3,
          -depth * t + (j ? Math.sin(a * 9 + j) * 0.12 : 0),
          Math.sin(a) * r,
        );
        color.set(j < 2 ? "#8b986c" : j < 4 ? "#b1b4a5" : "#9ba7a0");
        color.multiplyScalar(
          0.9 + Math.sin(a * 8 + j) * 0.1 + Math.cos(a * 13 - j) * 0.07,
        );
        colors.push(color.r, color.g, color.b);
        uv.push((i / 96) * 5, t * 2);
        if (j < levels.length - 1 && i < 96) {
          const n = j * 97 + i;
          indices.push(n, n + 1, n + 97, n + 1, n + 98, n + 97);
        }
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [radius, depth]);
  const stones = useMemo(() => {
    const rand = random(radius * 100);
    return Array.from({ length: 42 }, (_, i) => {
      const a = i * 2.399,
        t = 0.08 + rand() * 0.65,
        r = edgeRadius(a, radius) * (1 - t * 0.65);
      return {
        p: [Math.cos(a) * r, -depth * t - 0.12, Math.sin(a) * r] as V3,
        s: [
          0.3 + rand() * 0.45,
          0.2 + rand() * 0.38,
          0.25 + rand() * 0.5,
        ] as V3,
        r: [rand(), a, rand()] as V3,
        c: ["#89917a", "#a3a68e", "#707f72", "#b6b29b"][i % 4],
      };
    });
  }, [radius, depth]);
  const vines = useMemo(() => {
    const rnd = random(radius * 171);
    const instances: Instance[] = [];
    for (let i = 0; i < 24; i++) {
      const a = i * 2.399,
        length = 0.3 + rnd() * 1.3;
      for (let j = 0; j < 18; j++) {
        const y = (j / 18) * length,
          r = edgeRadius(a, radius) * (1 - (y / depth) * 0.6) + 0.015;
        instances.push({
          p: [Math.cos(a) * r + Math.sin(j * 2) * 0.07, -y, Math.sin(a) * r],
          s: [0.13, 0.13, 0.16],
          r: [rnd() * 3, rnd() * 6, 0],
          c: ["#587437", "#6c8342", "#879b52"][j % 3],
        });
      }
    }
    return instances;
  }, [radius, depth]);
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          vertexColors
          map={surfaces.cliff}
          bumpMap={surfaces.cliff}
          bumpScale={0.11}
          roughness={1}
        />
      </mesh>
      <Scatter instances={stones} geometry={rock} map={surfaces.cliff} />
      <Scatter instances={vines} geometry={leaf} />
    </group>
  );
}

export function Meadow({ radius }: { radius: number }) {
  const instances = useMemo(() => {
    const rand = random(radius * 391);
    const items: Instance[] = [];
    for (let i = 0; i < radius * radius * 70; i++) {
      const a = rand() * 6.28,
        r = Math.sqrt(rand()) * radius * 0.98,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r;
      // Keep the cottage entrance and stepping-stone path clear.
      if (
        (radius > 4 && Math.abs(x + 0.8) < 0.44 && z > 0.8 && z < 4.4) ||
        (radius < 4 && Math.abs(x) < 0.5 && z > 0 && z < 1.5)
      )
        continue;
      const h = 0.055 + rand() * 0.13;
      items.push({
        p: [x, 0.001, z],
        s: [h * 1.7, h, h],
        r: [0, rand() * 6.28, rand() * 0.3],
        c: ["#778e45", "#9ca958", "#b3b773", "#667f3b", "#849648"][i % 5],
      });
    }
    return items;
  }, [radius]);
  return <Scatter instances={instances} geometry={blade} />;
}

const cloudCanvas = document.createElement("canvas");
cloudCanvas.width = 512;
cloudCanvas.height = 256;
const cloudContext = cloudCanvas.getContext("2d")!;
for (let i = 0; i < 24; i++) {
  const a = i * 2.399,
    x = 256 + Math.cos(a) * (50 + i * 4),
    y = 135 + Math.sin(a) * 30,
    r = 33 + (i % 5) * 7;
  const gradient = cloudContext.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, "#ffffffb0");
  gradient.addColorStop(0.55, "#ffffff70");
  gradient.addColorStop(1, "#ffffff00");
  cloudContext.fillStyle = gradient;
  cloudContext.fillRect(x - r, y - r, r * 2, r * 2);
}
export const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
cloudTexture.colorSpace = THREE.SRGBColorSpace;

function Lamp() {
  const night = useGame((s) => s.viewHour > 19 || s.viewHour < 6);
  return (
    <group>
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.026, 0.045, 1.5, 12]} />
        <meshStandardMaterial
          color="#4b5d58"
          metalness={0.65}
          roughness={0.5}
        />
      </mesh>
      {[0.04, 0.11, 1.4].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.065, 0.085, 0.06, 12]} />
          <meshStandardMaterial
            color="#46534c"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.61, 0]}>
        <boxGeometry args={[0.19, 0.28, 0.19]} />
        <meshPhysicalMaterial
          color="#e5c890"
          emissive="#ffc474"
          emissiveIntensity={night ? 2 : 0.15}
          transparent
          opacity={0.75}
          roughness={0.1}
        />
      </mesh>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}${z}`} position={[x * 0.1, 1.61, z * 0.1]}>
            <boxGeometry args={[0.018, 0.3, 0.018]} />
            <meshStandardMaterial
              color="#4a5447"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        )),
      )}
      <mesh castShadow position={[0, 1.82, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.2, 0.16, 4]} />
        <meshStandardMaterial
          color="#586253"
          metalness={0.5}
          roughness={0.45}
        />
      </mesh>
    </group>
  );
}

function Windmill() {
  const blades = useRef<THREE.Group>(null);
  const weather = useGame((s) => s.viewWeather),
    speed = useRef(0.25);
  useFrame((_, delta) => {
    speed.current = THREE.MathUtils.damp(
      speed.current,
      weather === "rainy" ? 0.8 : weather === "cloudy" ? 0.5 : 0.25,
      2,
      delta,
    );
    if (blades.current) blades.current.rotation.z -= delta * speed.current;
  });
  return (
    <group scale={[1, 1.25, 1]}>
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.37, 0.63, 2.1, 24]} />
        <meshStandardMaterial
          map={surfaces.plaster}
          color="#d8d4bb"
          bumpMap={surfaces.plaster}
          bumpScale={0.025}
        />
      </mesh>
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.64, 0.68, 0.3, 24]} />
        <meshStandardMaterial
          map={surfaces.stone}
          color="#aaa68c"
          bumpMap={surfaces.stone}
          bumpScale={0.035}
        />
      </mesh>
      <mesh castShadow position={[0, 2.29, 0]}>
        <coneGeometry args={[0.55, 0.63, 24]} />
        <meshStandardMaterial
          map={surfaces.wood}
          color="#617369"
          roughness={0.9}
        />
      </mesh>
      <mesh position={[0, 0.32, 0.59]}>
        <boxGeometry args={[0.25, 0.62, 0.055]} />
        <meshStandardMaterial map={surfaces.wood} color="#7e6b51" />
      </mesh>
      <mesh position={[0.28, 1.12, 0.31]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.15, 0.24, 0.045]} />
        <meshStandardMaterial
          color="#677e7a"
          roughness={0.22}
          metalness={0.3}
        />
      </mesh>
      <group ref={blades} position={[0, 1.86, 0.49]} rotation={[0.04, 0, 0.16]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <mesh castShadow position={[0, 0.73, 0]}>
              <boxGeometry args={[0.055, 1.65, 0.055]} />
              <meshStandardMaterial map={surfaces.wood} color="#8e7b59" />
            </mesh>
            <mesh castShadow position={[0.13, 0.94, 0.015]}>
              <boxGeometry args={[0.25, 0.84, 0.017]} />
              <meshStandardMaterial
                map={surfaces.plaster}
                color="#dad3b6"
                side={THREE.DoubleSide}
              />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <mesh key={n} position={[0.13, 0.55 + n * 0.15, 0.035]}>
                <boxGeometry args={[0.3, 0.018, 0.025]} />
                <meshStandardMaterial color="#897758" />
              </mesh>
            ))}
            <mesh position={[0.27, 0.94, 0.035]}>
              <boxGeometry args={[0.02, 0.9, 0.025]} />
              <meshStandardMaterial color="#897758" />
            </mesh>
          </group>
        ))}
        <mesh>
          <sphereGeometry args={[0.12, 16, 8]} />
          <meshStandardMaterial
            color="#6b6757"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

export function ItemMesh({ kind, seed = 1 }: { kind: Kind; seed?: number }) {
  if (kind === "tree") return <NaturalTree seed={seed} />;
  if (kind === "cottage") return <NaturalCottage />;
  if (kind === "flowers") return <NaturalFlowers />;
  if (kind === "lamp") return <Lamp />;
  if (kind === "windmill") return <Windmill />;
  if (kind === "rock") return <NaturalRock seed={seed} />;
  if (kind === "pond") return <NaturalPond />;
  if (kind === "fence")
    return (
      <group>
        {[-0.4, 0.4].map((x) => (
          <mesh key={x} castShadow position={[x, 0.34, 0]}>
            <boxGeometry args={[0.075, 0.68, 0.075]} />
            <meshStandardMaterial map={surfaces.wood} color="#c2b99c" />
          </mesh>
        ))}
        {[0.2, 0.46].map((y) => (
          <mesh key={y} castShadow position={[0, y, 0]}>
            <boxGeometry args={[1, 0.065, 0.05]} />
            <meshStandardMaterial map={surfaces.wood} color="#c2b99c" />
          </mesh>
        ))}
      </group>
    );
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[2.15, 1.7, 1.65]} />
        <meshStandardMaterial map={surfaces.stone} color="#d2cfb8" />
      </mesh>
      <mesh castShadow position={[0, 1.95, 0]}>
        <coneGeometry args={[1.5, 0.8, 4]} />
        <meshStandardMaterial map={surfaces.roof} color="#c98d74" />
      </mesh>
      {[-1, 1].map((x) => (
        <group key={x} position={[x, 0, 0.6]}>
          <mesh castShadow position={[0, 1.25, 0]}>
            <cylinderGeometry args={[0.36, 0.43, 2.5, 16]} />
            <meshStandardMaterial map={surfaces.stone} color="#d2cfb8" />
          </mesh>
          <mesh castShadow position={[0, 2.8, 0]}>
            <coneGeometry args={[0.55, 0.8, 16]} />
            <meshStandardMaterial color="#a45e59" map={surfaces.roof} />
          </mesh>
          <mesh position={[0, 1.65, 0.365]}>
            <boxGeometry args={[0.17, 0.34, 0.025]} />
            <meshStandardMaterial color="#6f9599" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.48, 0.84]}>
        <boxGeometry args={[0.48, 0.96, 0.04]} />
        <meshStandardMaterial map={surfaces.wood} color="#88765b" />
      </mesh>
    </group>
  );
}

export function Bridge() {
  return (
    <group position={[4.1, -0.16, -1]} rotation={[0, 0.5, -0.07]}>
      {Array.from({ length: 16 }, (_, i) => (
        <group
          key={i}
          position={[i * 0.18, Math.sin((i / 15) * Math.PI) * -0.1, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            rotation={[0, ((i % 3) - 1) * 0.02, 0]}
          >
            <boxGeometry args={[0.165, 0.075, 1.03]} />
            <meshStandardMaterial
              map={surfaces.wood}
              color={i % 3 ? "#b6a17b" : "#998767"}
              roughness={0.9}
            />
          </mesh>
          {[-0.39, 0.39].map((z) => (
            <mesh
              key={z}
              position={[0, 0.04, z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.011, 6]} />
              <meshStandardMaterial color="#5d5c50" metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      {[-0.48, 0.48].map((z) => (
        <group key={z}>
          {[0, 1.35, 2.7].map((x) => (
            <mesh key={x} castShadow position={[x, 0.4, z]}>
              <cylinderGeometry args={[0.035, 0.05, 0.82, 10]} />
              <meshStandardMaterial map={surfaces.wood} color="#8c8063" />
            </mesh>
          ))}
          {[0.4, 0.73].map((y) => (
            <Line
              key={y}
              points={[
                [0, y, z],
                [0.67, y - 0.13, z],
                [1.35, y, z],
                [2.02, y - 0.13, z],
                [2.7, y, z],
              ]}
              color="#b7ab8d"
              lineWidth={2}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

export function Cloud({
  position,
  size = 1,
}: {
  position: [number, number, number];
  size?: number;
}) {
  const ref = useRef<THREE.Sprite>(null);
  const material = useRef<THREE.SpriteMaterial>(null),
    weather = useGame((s) => s.viewWeather);
  const night = useGame((s) => s.viewHour > 19 || s.viewHour < 6);
  useFrame(({ clock }, delta) => {
    const storm = weather === "rainy" || weather === "cloudy";
    if (ref.current) {
      ref.current.position.x =
        position[0] + Math.sin(clock.elapsedTime * 0.065 + position[2]) * 1.4;
      ref.current.scale.x = THREE.MathUtils.damp(
        ref.current.scale.x,
        7 * size * (storm ? 1.45 : 1),
        2,
        delta,
      );
    }
    if (material.current) {
      material.current.opacity = THREE.MathUtils.damp(
        material.current.opacity,
        night ? 0.3 : storm ? 0.88 : 0.52,
        2,
        delta,
      );
      material.current.color.lerp(
        new THREE.Color(
          night ? "#7b91b1" : weather === "rainy" ? "#9bafbd" : "#ffffff",
        ),
        1 - Math.exp(-delta * 2),
      );
    }
  });
  return (
    <sprite ref={ref} position={position} scale={[7 * size, 3.5 * size, 1]}>
      <spriteMaterial
        ref={material}
        map={cloudTexture}
        transparent
        opacity={0.52}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

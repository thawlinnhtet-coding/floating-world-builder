import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars, SoftShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  Bridge,
  Cloud,
  ItemMesh,
  Meadow,
  NaturalCliff,
  cloudTexture,
  groundGeometry,
  surfaces,
} from "./Assets";
import { CatalogPreviews } from "./CatalogPreviews";
import { candidate, place, select, useGame } from "./store";
import { catalog, cells, placementError, positions, progress } from "./world";
import type { ObjectData } from "./world";

const Model = memo(function Model({
  object,
  clean,
}: {
  object: ObjectData;
  clean: boolean;
}) {
  const points = cells(object),
    x = points.reduce((a, p) => a + p[0], 0) / points.length,
    z = points.reduce((a, p) => a + p[1], 0) / points.length;
  const selected = useGame((s) => s.selected === object.id);
  const animated = useRef<THREE.Group>(null),
    age = useRef(0);
  useFrame((_, delta) => {
    if (!animated.current) return;
    age.current += delta;
    const t = Math.min(age.current / 0.65, 1),
      pop =
        t === 1 ? 1 : 1 + Math.pow(1 - t, 3) * Math.sin(t * Math.PI * 3) * 0.16;
    animated.current.scale.setScalar(pop);
    animated.current.rotation.y = THREE.MathUtils.damp(
      animated.current.rotation.y,
      (-object.rotation * Math.PI) / 2,
      12,
      delta,
    );
  });
  return (
    <group
      position={[x, 0, z]}
      onClick={(e) => {
        if (clean || e.delta > 4) return;
        if (useGame.getState().tool === "explore") {
          e.stopPropagation();
          select(object.id);
        }
      }}
    >
      <group ref={animated}>
        <ItemMesh
          kind={object.kind}
          seed={Array.from(object.id).reduce((n, c) => n + c.charCodeAt(0), 0)}
        />
      </group>
      {selected && !clean && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.74, 48]} />
          <meshBasicMaterial color="#edca8b" />
        </mesh>
      )}
    </group>
  );
});
function Island({ island, clean }: { island: 0 | 1; clean: boolean }) {
  const s = useGame(),
    radius = island === 0 ? 5.7 : 3.6,
    ground = useMemo(() => groundGeometry(radius), [radius]);
  const [hover, setHover] = useState<[number, number] | null>(null),
    p = positions[island];
  const o = hover ? candidate(hover[0], hover[1], island) : null,
    error = o
      ? placementError(
          s.world,
          o,
          s.tool === "move" ? (s.selected ?? undefined) : undefined,
        )
      : "";
  const challenge = progress(s.world, s.selected ?? undefined),
    target = s.world.objects.find((o) => o.id === challenge.targetId),
    areaIsland = target?.island ?? 0;
  function groundPoint(e: { ray: THREE.Ray }) {
    return e.ray.intersectPlane(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -p[1]),
      new THREE.Vector3(),
    );
  }
  function pointer(e: ThreeEvent<PointerEvent>) {
    const point = groundPoint(e);
    if (!clean && point && s.mode === "owner" && s.tool !== "explore")
      setHover([Math.round(point.x - p[0]), Math.round(point.z - p[2])]);
  }
  return (
    <group
      position={p}
      onPointerMove={pointer}
      onPointerLeave={() => setHover(null)}
      onClick={(e) => {
        if (clean || e.delta > 4 || s.mode !== "owner") return;
        e.stopPropagation();
        const point = groundPoint(e);
        if (point && s.tool !== "explore")
          place(Math.round(point.x - p[0]), Math.round(point.z - p[2]), island);
      }}
    >
      <mesh receiveShadow geometry={ground}>
        <meshStandardMaterial
          map={surfaces.grass}
          color="#d1ddad"
          bumpMap={surfaces.grass}
          bumpScale={0.035}
        />
      </mesh>
      <NaturalCliff radius={radius} depth={island === 0 ? 3.8 : 2.65} />
      <Meadow radius={radius} />
      {s.world.objects
        .filter((o) => o.island === island)
        .map((o) => (
          <Model key={o.id} object={o} clean={clean} />
        ))}
      {!clean && s.mode === "owner" && (s.grid || s.tool !== "explore") && (
        <gridHelper
          args={[
            island === 0 ? 10 : 6,
            island === 0 ? 10 : 6,
            "#b3be9d",
            "#a7b78c",
          ]}
          position={[0, 0.02, 0]}
        />
      )}
      {!clean &&
        s.mode === "owner" &&
        areaIsland === island &&
        challenge.area.map(([x, z]) => (
          <mesh
            key={`${x},${z}`}
            position={[x, 0.022, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.92, 0.92]} />
            <meshBasicMaterial
              color="#f3cd78"
              transparent
              opacity={0.19}
              depthWrite={false}
            />
          </mesh>
        ))}
      {!clean &&
        s.mode === "owner" &&
        s.tool !== "explore" &&
        o &&
        cells(o).map(([x, z]) => (
          <mesh key={`${x},${z}`} position={[x, 0.12, z]}>
            <boxGeometry args={[0.93, 0.22, 0.93]} />
            <meshBasicMaterial
              color={error ? "#ce736e" : "#e4d895"}
              transparent
              opacity={0.58}
            />
          </mesh>
        ))}
    </group>
  );
}
function WeatherParticles() {
  const weather = useGame((s) => s.viewWeather),
    enabled = useGame((s) => s.world.settings.particles);
  const rain = useRef<THREE.LineSegments>(null),
    snow = useRef<THREE.Points>(null),
    rainMaterial = useRef<THREE.LineBasicMaterial>(null),
    snowMaterial = useRef<THREE.PointsMaterial>(null);
  const drops = useMemo(
    () =>
      Float32Array.from({ length: 720 * 6 }, (_, i) =>
        i % 3 === 1 ? Math.random() * 18 - 3 : Math.random() * 32 - 12,
      ),
    [],
  );
  const flakes = useMemo(
    () =>
      Float32Array.from({ length: 500 * 3 }, (_, i) =>
        i % 3 === 1 ? Math.random() * 18 - 3 : Math.random() * 32 - 12,
      ),
    [],
  );
  const flakeTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const ctx = c.getContext("2d")!,
      g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "#ffffffff");
    g.addColorStop(0.35, "#fffffff0");
    g.addColorStop(1, "#ffffff00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => flakeTexture.dispose(), [flakeTexture]);
  useFrame(({ clock }, delta) => {
    if (rainMaterial.current)
      rainMaterial.current.opacity = THREE.MathUtils.damp(
        rainMaterial.current.opacity,
        enabled && weather === "rainy" ? 0.64 : 0,
        2,
        delta,
      );
    if (snowMaterial.current)
      snowMaterial.current.opacity = THREE.MathUtils.damp(
        snowMaterial.current.opacity,
        enabled && weather === "snowy" ? 0.92 : 0,
        2,
        delta,
      );
    if (enabled && weather === "rainy") {
      for (let i = 0; i < drops.length; i += 6) {
        drops[i] -= delta * 1.8;
        drops[i + 1] -= delta * 10;
        if (drops[i + 1] < -3) {
          drops[i + 1] = 15;
          drops[i] = Math.random() * 32 - 12;
        }
        drops[i + 3] = drops[i] + 0.07;
        drops[i + 4] = drops[i + 1] + 0.48;
        drops[i + 5] = drops[i + 2];
      }
      if (rain.current)
        rain.current.geometry.attributes.position.needsUpdate = true;
    }
    if (enabled && weather === "snowy") {
      for (let i = 0; i < flakes.length; i += 3) {
        flakes[i] += Math.sin(clock.elapsedTime * 0.7 + i) * delta * 0.22;
        flakes[i + 1] -= delta * (0.65 + (i % 5) * 0.08);
        if (flakes[i + 1] < -3) flakes[i + 1] = 15;
      }
      if (snow.current)
        snow.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <>
      <lineSegments ref={rain}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[drops, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={rainMaterial}
          color="#d4e6f4"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={snow}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[flakes, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={snowMaterial}
          map={flakeTexture}
          color="#ffffff"
          size={5}
          sizeAttenuation={false}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </>
  );
}
function Lighting() {
  const hour = useGame((s) => s.viewHour),
    weather = useGame((s) => s.viewWeather),
    shadows = useGame((s) => s.world.settings.shadows);
  const light = useRef<THREE.DirectionalLight>(null),
    ambient = useRef<THREE.AmbientLight>(null);
  const sky = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 128;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return {
      canvas,
      texture,
      colors: [
        new THREE.Color("#7db5d0"),
        new THREE.Color("#b4d6df"),
        new THREE.Color("#e3e9dd"),
      ],
      time: 0,
    };
  }, []);
  const environment = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!,
      gradient = ctx.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, "#a8d4e9");
    gradient.addColorStop(0.48, "#e7f2f1");
    gradient.addColorStop(0.52, "#8b9c6c");
    gradient.addColorStop(1, "#4c563d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#fff5da";
    ctx.beginPath();
    ctx.arc(75, 32, 8, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);
  const night = hour < 6 || hour >= 20,
    dusk = hour >= 17 && hour < 20,
    cloudy = weather === "rainy" || weather === "cloudy";
  useFrame((_, delta) => {
    if (light.current) {
      light.current.intensity = THREE.MathUtils.damp(
        light.current.intensity,
        night ? 0.85 : cloudy ? 1.5 : 3.1,
        2,
        delta,
      );
      light.current.color.lerp(
        new THREE.Color(night ? "#bbd1ff" : dusk ? "#ffd1a4" : "#fff3d6"),
        1 - Math.exp(-delta * 2),
      );
    }
    if (ambient.current)
      ambient.current.intensity = THREE.MathUtils.damp(
        ambient.current.intensity,
        night ? 0.2 : 0.34,
        2,
        delta,
      );
    const targets = night
      ? ["#14243e", "#344c6a", "#829da9"]
      : dusk
        ? ["#ac8da9", "#e7ad95", "#f4dec1"]
        : weather === "rainy"
          ? ["#506b82", "#8ba1b2", "#beced1"]
          : weather === "snowy"
            ? ["#9cb7cf", "#d0dfeb", "#eff5f3"]
            : cloudy
              ? ["#829ca9", "#b3c7ca", "#dde2da"]
              : ["#65afe1", "#b0dced", "#e5f0df"];
    sky.colors.forEach((c, i) =>
      c.lerp(new THREE.Color(targets[i]), 1 - Math.exp(-delta * 2)),
    );
    sky.time += delta;
    if (sky.time > 0.1) {
      sky.time = 0;
      const ctx = sky.canvas.getContext("2d")!,
        g = ctx.createLinearGradient(0, 0, 0, 128);
      sky.colors.forEach((c, i) =>
        g.addColorStop(i / 2, `#${c.getHexString()}`),
      );
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 2, 128);
      sky.texture.needsUpdate = true;
    }
  });
  useEffect(() => () => sky.texture.dispose(), [sky]);
  useEffect(() => () => environment.dispose(), [environment]);
  return (
    <>
      <primitive attach="background" object={sky.texture} />
      <primitive attach="environment" object={environment} />
      <ambientLight ref={ambient} intensity={0.34} />
      <hemisphereLight args={["#bedceb", "#8d8d59", 0.75]} />
      <directionalLight
        position={[6, 3, 12]}
        intensity={night ? 0.12 : 0.65}
        color="#d7e5e6"
      />
      <directionalLight
        ref={light}
        castShadow={shadows}
        position={[-4, 12, 7]}
        intensity={3.1}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-normalBias={0.025}
        shadow-bias={-0.0002}
      />
      {night && <Stars radius={45} depth={25} count={600} factor={2} fade />}
    </>
  );
}
function SecondIsland({ clean }: { clean: boolean }) {
  const mist = useRef<THREE.SpriteMaterial>(null);
  useFrame((_, delta) => {
    if (mist.current)
      mist.current.opacity = THREE.MathUtils.damp(
        mist.current.opacity,
        0,
        1.4,
        delta,
      );
  });
  return (
    <>
      <Island island={1} clean={clean} />
      <sprite position={[8.7, 0.3, -2.5]} scale={[9, 5, 1]}>
        <spriteMaterial
          ref={mist}
          map={cloudTexture}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </sprite>
    </>
  );
}
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = Math.min(48, size.width / 26);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);
  return null;
}
function Scene({ clean }: { clean: boolean }) {
  const completed = useGame((s) => s.world.completed);
  return (
    <>
      <Lighting />
      <SoftShadows size={18} samples={6} focus={0.3} />
      <ResponsiveCamera />
      <Island island={0} clean={clean} />
      {completed >= 9 && <SecondIsland clean={clean} />}{" "}
      {completed >= 8 && <Bridge />}
      {completed === 8 && <Cloud position={[8.7, 0.3, -2.5]} size={1.3} />}
      <Cloud position={[-9, -2.8, -4]} size={1.7} />
      <Cloud position={[3, -4.5, 4]} size={2.4} />
      <Cloud position={[12, -3, 1]} size={1.5} />
      <Cloud position={[-3, -3, 7]} size={1.9} />
      <Cloud position={[4, -1, -10]} size={1.8} />
      <Cloud position={[-10, 1.7, -9]} size={1.2} />
      <group visible={false}>
        {catalog.map((c, i) => (
          <group
            key={c.kind}
            userData={{ catalogKind: c.kind, previewSeed: 5 }}
            position={[i * 4, 0, 30]}
          >
            <ItemMesh kind={c.kind} seed={5} />
          </group>
        ))}
      </group>
      <CatalogPreviews />
      <WeatherParticles />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.07}
        target={[1, 0, 0]}
        minZoom={23}
        maxZoom={100}
        minPolarAngle={0.3}
        maxPolarAngle={1.32}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />
    </>
  );
}
let capture: (() => void) | undefined;
export function captureScene() {
  capture?.();
}
export function WorldScene({ clean = false }: { clean?: boolean }) {
  const [active, setActive] = useState(!document.hidden);
  useEffect(() => {
    const change = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      role="application"
      aria-label="Floating island canvas"
      shadows="percentage"
      orthographic
      camera={{ position: [15, 13, 19], zoom: 48, near: 0.1, far: 150 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl, scene, camera }) => {
        capture = () => {
          gl.render(scene, camera);
          gl.domElement.toBlob((blob) => {
            if (!blob) {
              useGame.setState({ notice: "Capture failed. Please try again." });
              return;
            }
            const url = URL.createObjectURL(blob),
              link = document.createElement("a");
            link.href = url;
            link.download = "floating-world.png";
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            useGame.setState({ notice: "Screenshot captured." });
          }, "image/png");
        };
      }}
    >
      <Scene clean={clean} />
    </Canvas>
  );
}

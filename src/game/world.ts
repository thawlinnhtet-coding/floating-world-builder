export const VERSION = 1;
// A single policy is consumed by placement, import, and the publication service.
export const MAX_OBJECTS = 80;
export const MAX_BYTES = 192_000;
export const kinds = [
  "tree",
  "rock",
  "flowers",
  "cottage",
  "fence",
  "lamp",
  "windmill",
  "pond",
  "castle",
] as const;
export type Kind = (typeof kinds)[number];
export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";
export type ObjectData = {
  id: string;
  kind: Kind;
  x: number;
  z: number;
  island: 0 | 1;
  rotation: number;
};
export type Atmosphere = {
  weather: Weather;
  hour: number;
  autoWeather: boolean;
  autoTime: boolean;
};
export type World = {
  version: 1;
  sceneVersion: 1;
  id: string;
  name: string;
  objects: ObjectData[];
  completed: number;
  settings: { atmosphere: Atmosphere; shadows: boolean; particles: boolean };
};
export type Management = {
  token: string;
  requestId: string;
  publicId?: string;
};
export type Backup = {
  format: "floating-world-backup";
  version: 1;
  world: World;
  management?: Management;
};
export type Snapshot = {
  version: 1;
  sceneVersion: 1;
  name: string;
  objects: ObjectData[];
  completed: number;
  atmosphere: Atmosphere;
};
export const catalog: {
  kind: Kind;
  name: string;
  category: string;
  unlock: number;
  size: number;
}[] = [
  { kind: "tree", name: "Cloudwood", category: "Nature", unlock: 0, size: 1 },
  { kind: "rock", name: "River stone", category: "Nature", unlock: 1, size: 1 },
  {
    kind: "flowers",
    name: "Wildflowers",
    category: "Nature",
    unlock: 2,
    size: 1,
  },
  {
    kind: "cottage",
    name: "Cozy cottage",
    category: "Buildings",
    unlock: 3,
    size: 2,
  },
  {
    kind: "fence",
    name: "Picket fence",
    category: "Details",
    unlock: 4,
    size: 1,
  },
  {
    kind: "lamp",
    name: "Street lamp",
    category: "Details",
    unlock: 5,
    size: 1,
  },
  {
    kind: "windmill",
    name: "Windmill",
    category: "Buildings",
    unlock: 6,
    size: 2,
  },
  { kind: "pond", name: "Garden pond", category: "Nature", unlock: 7, size: 2 },
  {
    kind: "castle",
    name: "Sky castle",
    category: "Buildings",
    unlock: 10,
    size: 3,
  },
];
export const positions: [number, number, number][] = [
  [-1.5, 0, 0.8],
  [8.7, -0.55, -2.5],
];
export const titles = [
  "Plant three trees",
  "Add three river stones",
  "Grow a flower garden",
  "Build your first cottage",
  "Frame your cottage",
  "Light the way",
  "Catch the breeze",
  "Create a pond garden",
  "A scenic bridge entrance",
  "Make yourself at home",
];
export const rewards = [
  "River stones",
  "Wildflowers",
  "Cozy cottage",
  "Picket fences",
  "Street lamps",
  "Windmill",
  "Garden pond",
  "Sky bridge",
  "Second island",
  "Sky castle",
];
export function freshWorld(): World {
  return {
    version: 1,
    sceneVersion: 1,
    id: crypto.randomUUID(),
    name: "Willow Haven",
    objects: [],
    completed: 0,
    settings: {
      atmosphere: {
        weather: "sunny",
        hour: 14,
        autoWeather: true,
        autoTime: true,
      },
      shadows: true,
      particles: true,
    },
  };
}
export function cells(
  o: Pick<ObjectData, "kind" | "x" | "z" | "rotation">,
): [number, number][] {
  const size = catalog.find((c) => c.kind === o.kind)!.size,
    result: [number, number][] = [];
  for (let x = 0; x < size; x++)
    for (let z = 0; z < size; z++) {
      let a = x,
        b = z;
      for (let r = 0; r < o.rotation; r++) [a, b] = [-b, a];
      result.push([o.x + a, o.z + b]);
    }
  return result;
}
export function inside(x: number, z: number, island: number) {
  return x * x + z * z <= (island === 0 ? 25 : 10);
}
export function placementError(
  world: World,
  o: ObjectData,
  ignore?: string,
): string {
  if (o.island === 1 && world.completed < 9)
    return "The second island is still waiting in the clouds.";
  if ((catalog.find((c) => c.kind === o.kind)?.unlock ?? 99) > world.completed)
    return "Complete the next challenge to unlock this item.";
  if (!ignore && world.objects.length >= MAX_OBJECTS)
    return `This world has reached its ${MAX_OBJECTS}-object limit. Remove something or export a backup.`;
  const target = cells(o);
  if (target.some(([x, z]) => !inside(x, z, o.island)))
    return "Keep the whole footprint on the island.";
  if (
    world.objects.some(
      (p) =>
        p.id !== ignore &&
        p.island === o.island &&
        cells(p).some(([x, z]) => target.some(([a, b]) => a === x && b === z)),
    )
  )
    return "That space is already occupied.";
  return "";
}
export type Requirement = { label: string; count: number; target: number };
export type Progress = {
  requirements: Requirement[];
  area: [number, number][];
  targetId?: string;
};
function region(o: ObjectData): [number, number][] {
  const footprint = cells(o),
    xs = footprint.map((c) => c[0]),
    zs = footprint.map((c) => c[1]),
    out: [number, number][] = [];
  for (let x = Math.min(...xs) - 2; x <= Math.max(...xs) + 2; x++)
    for (let z = Math.min(...zs) - 2; z <= Math.max(...zs) + 2; z++)
      if (
        inside(x, z, o.island) &&
        !footprint.some((c) => c[0] === x && c[1] === z)
      )
        out.push([x, z]);
  return out;
}
export function progress(w: World, preferred?: string): Progress {
  const count = (kind: Kind, island?: number) =>
    w.objects.filter(
      (o) => o.kind === kind && (island === undefined || o.island === island),
    ).length;
  const req = (label: string, n: number, target: number): Requirement => ({
    label,
    count: n,
    target,
  });
  const simple: Partial<Record<number, [Kind, number, string]>> = {
    0: ["tree", 3, "Trees"],
    1: ["rock", 3, "River stones"],
    2: ["flowers", 5, "Wildflowers"],
    3: ["cottage", 1, "Cottage"],
    5: ["lamp", 3, "Street lamps"],
    6: ["windmill", 1, "Windmill"],
  };
  const rule = simple[w.completed];
  if (rule)
    return { requirements: [req(rule[2], count(rule[0]), rule[1])], area: [] };
  if (w.completed === 4 || w.completed === 7) {
    const targetKind = w.completed === 4 ? "cottage" : "pond",
      decoration = w.completed === 4 ? "fence" : "flowers",
      needed = w.completed === 4 ? 6 : 5;
    const candidates = w.objects
      .filter((o) => o.kind === targetKind)
      .map((o) => {
        const area = region(o);
        return {
          o,
          area,
          n: w.objects.filter(
            (p) =>
              p.kind === decoration &&
              p.island === o.island &&
              area.some(([x, z]) => p.x === x && p.z === z),
          ).length,
        };
      })
      .sort((a, b) => b.n - a.n);
    const chosen =
      candidates.find((c) => c.o.id === preferred) ?? candidates[0];
    return {
      requirements: [
        req(targetKind === "pond" ? "Pond" : "Cottage", chosen ? 1 : 0, 1),
        req(
          decoration === "fence" ? "Nearby fence sections" : "Nearby flowers",
          chosen?.n ?? 0,
          needed,
        ),
      ],
      area: chosen?.area ?? [],
      targetId: chosen?.o.id,
    };
  }
  if (w.completed === 8) {
    const area: [number, number][] = [];
    for (let x = 2; x <= 4; x++)
      for (let z = -3; z <= 1; z++) if (inside(x, z, 0)) area.push([x, z]);
    const n = (kind: Kind) =>
      w.objects.filter(
        (o) =>
          o.kind === kind &&
          o.island === 0 &&
          area.some((c) => c[0] === o.x && c[1] === o.z),
      ).length;
    return {
      requirements: [
        req("Entrance street lamps", n("lamp"), 2),
        req("Entrance flowers", n("flowers"), 5),
      ],
      area,
    };
  }
  if (w.completed === 9)
    return {
      requirements: [
        req("Cottage on island two", count("cottage", 1), 1),
        req("Trees on island two", count("tree", 1), 3),
        req("Flowers on island two", count("flowers", 1), 5),
        req("Lamps on island two", count("lamp", 1), 3),
      ],
      area: [],
    };
  return { requirements: [], area: [] };
}
export function advance(w: World): World {
  let next = w;
  while (
    next.completed < 10 &&
    progress(next).requirements.every((r) => r.count >= r.target)
  )
    next = { ...next, completed: next.completed + 1 };
  return next;
}
function record(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
export function validateWorld(value: unknown): World {
  if (!record(value) || value.version !== 1 || value.sceneVersion !== 1)
    throw new Error(
      "Unsupported world version. Your current world has not been replaced.",
    );
  if (
    typeof value.id !== "string" ||
    value.id.length > 100 ||
    !value.id ||
    typeof value.name !== "string" ||
    value.name.length > 40 ||
    !value.name.trim()
  )
    throw new Error("Invalid world identity.");
  if (
    !Number.isInteger(value.completed) ||
    Number(value.completed) < 0 ||
    Number(value.completed) > 10 ||
    !Array.isArray(value.objects) ||
    value.objects.length > MAX_OBJECTS
  )
    throw new Error(
      `Invalid progression or object limit (maximum ${MAX_OBJECTS}).`,
    );
  if (
    !record(value.settings) ||
    typeof value.settings.shadows !== "boolean" ||
    typeof value.settings.particles !== "boolean" ||
    !record(value.settings.atmosphere)
  )
    throw new Error("Invalid graphics settings.");
  const a = value.settings.atmosphere;
  if (
    !["sunny", "cloudy", "rainy", "snowy"].includes(String(a.weather)) ||
    typeof a.hour !== "number" ||
    !Number.isFinite(a.hour) ||
    a.hour < 0 ||
    a.hour >= 24 ||
    typeof a.autoTime !== "boolean" ||
    typeof a.autoWeather !== "boolean"
  )
    throw new Error("Invalid atmosphere settings.");
  const w: World = {
    version: 1,
    sceneVersion: 1,
    id: value.id,
    name: value.name.trim(),
    completed: Number(value.completed),
    objects: [],
    settings: {
      shadows: value.settings.shadows,
      particles: value.settings.particles,
      atmosphere: {
        weather: a.weather as Weather,
        hour: a.hour,
        autoTime: a.autoTime,
        autoWeather: a.autoWeather,
      },
    },
  };
  const ids = new Set<string>();
  for (const raw of value.objects) {
    if (
      !record(raw) ||
      typeof raw.id !== "string" ||
      !raw.id ||
      raw.id.length > 100 ||
      ids.has(raw.id) ||
      !kinds.includes(raw.kind as Kind) ||
      ![0, 1].includes(Number(raw.island)) ||
      typeof raw.island !== "number" ||
      !Number.isInteger(raw.x) ||
      !Number.isInteger(raw.z) ||
      Math.abs(Number(raw.x)) > 10 ||
      Math.abs(Number(raw.z)) > 10 ||
      !Number.isInteger(raw.rotation) ||
      Number(raw.rotation) < 0 ||
      Number(raw.rotation) > 3
    )
      throw new Error("Invalid object data.");
    const o: ObjectData = {
      id: raw.id,
      kind: raw.kind as Kind,
      x: Number(raw.x),
      z: Number(raw.z),
      rotation: Number(raw.rotation),
      island: raw.island as 0 | 1,
    };
    const error = placementError(w, o);
    if (error) throw new Error(error);
    ids.add(o.id);
    w.objects.push(o);
  }
  return advance(w);
}
export function validateManagement(v: unknown): Management | undefined {
  if (v === undefined) return undefined;
  if (
    !record(v) ||
    typeof v.token !== "string" ||
    !/^[a-f0-9]{64}$/.test(v.token) ||
    typeof v.requestId !== "string" ||
    !/^[a-f0-9-]{36}$/.test(v.requestId) ||
    (v.publicId !== undefined &&
      (typeof v.publicId !== "string" || !/^[a-f0-9-]{36}$/.test(v.publicId)))
  )
    throw new Error("Invalid private publication information.");
  return {
    token: v.token,
    requestId: v.requestId,
    ...(v.publicId ? { publicId: v.publicId as string } : {}),
  };
}
export function validateBackup(v: unknown): Backup {
  if (!record(v) || v.format !== "floating-world-backup" || v.version !== 1)
    throw new Error("This is not a supported Floating World backup.");
  return {
    format: "floating-world-backup",
    version: 1,
    world: validateWorld(v.world),
    management: validateManagement(v.management),
  };
}
export function snapshot(
  w: World,
  atmosphere = w.settings.atmosphere,
): Snapshot {
  return {
    version: 1,
    sceneVersion: 1,
    name: w.name,
    objects: w.objects.map((o) => ({ ...o })),
    completed: w.completed,
    atmosphere: { ...atmosphere },
  };
}
export function validateSnapshot(v: unknown): Snapshot {
  if (!record(v)) throw new Error("Invalid snapshot.");
  const allowed = [
    "version",
    "sceneVersion",
    "name",
    "objects",
    "completed",
    "atmosphere",
  ];
  if (Object.keys(v).some((k) => !allowed.includes(k)))
    throw new Error("Private or unknown snapshot fields are not allowed.");
  const w = validateWorld({
    ...v,
    id: "public",
    settings: { shadows: true, particles: true, atmosphere: v.atmosphere },
  });
  return snapshot(w);
}
export function fromSnapshot(s: Snapshot): World {
  return {
    version: 1,
    sceneVersion: 1,
    id: "visitor",
    name: s.name,
    objects: s.objects,
    completed: s.completed,
    settings: { shadows: true, particles: true, atmosphere: s.atmosphere },
  };
}

import { create } from "zustand";
import { openDB } from "idb";
import {
  advance,
  freshWorld,
  fromSnapshot,
  placementError,
  snapshot,
  validateBackup,
  validateSnapshot,
} from "./world";
import type {
  Atmosphere,
  Backup,
  Kind,
  Management,
  ObjectData,
  Weather,
  World,
} from "./world";

const database = () =>
  openDB("floating-world-builder", 1, {
    upgrade(db) {
      db.createObjectStore("worlds");
    },
  });
let writes = Promise.resolve();
let revision = 0;
let boot: Promise<void> | undefined;
type State = {
  world: World;
  mode: "owner" | "visitor";
  loading: boolean;
  loadError: string;
  saveState: "saving" | "saved" | "error";
  saveError: string;
  management?: Management;
  tool: "explore" | "place" | "move";
  item: Kind;
  rotation: number;
  selected: string | null;
  grid: boolean;
  history: ObjectData[][];
  future: ObjectData[][];
  notice: string;
  viewHour: number;
  viewWeather: Weather;
  previews: Partial<Record<Kind, string>>;
  publicationBusy: boolean;
  publicationError: string;
  celebrating: boolean;
  patch: (v: Partial<State>) => void;
};
export const useGame = create<State>((set) => ({
  world: freshWorld(),
  mode: location.pathname.startsWith("/world/") ? "visitor" : "owner",
  loading: true,
  loadError: "",
  saveState: "saved",
  saveError: "",
  tool: "explore",
  item: "tree",
  rotation: 0,
  selected: null,
  grid: false,
  history: [],
  future: [],
  notice: "",
  viewHour: 14,
  viewWeather: "sunny",
  previews: {},
  publicationBusy: false,
  publicationError: "",
  celebrating: false,
  patch: (v) => set(v),
}));
function privateBackup(): Backup {
  const s = useGame.getState();
  return {
    format: "floating-world-backup",
    version: 1,
    world: s.world,
    ...(s.management ? { management: s.management } : {}),
  };
}
export function save(): Promise<boolean> {
  const s = useGame.getState();
  if (s.mode === "visitor" || s.loading || s.loadError)
    return Promise.resolve(false);
  const value = structuredClone(privateBackup()),
    current = ++revision;
  useGame.setState({ saveState: "saving", saveError: "" });
  const task = writes
    .catch(() => {})
    .then(async () => {
      const db = await database();
      await db.put("worlds", value, "active");
      db.close();
    });
  writes = task;
  return task.then(
    () => {
      if (current === revision) useGame.setState({ saveState: "saved" });
      return true;
    },
    (error) => {
      if (current === revision)
        useGame.setState({
          saveState: "error",
          saveError: `Local save failed: ${error instanceof Error ? error.message : "storage unavailable"}. Export a backup to protect your work.`,
        });
      return false;
    },
  );
}
export async function start() {
  if (boot) return boot;
  boot = (async () => {
    const visitor = useGame.getState().mode === "visitor";
    try {
      if (visitor) {
        await loadVisit();
        return;
      }
      const db = await database(),
        value = await db.get("worlds", "active");
      db.close();
      const b = value
        ? validateBackup(value)
        : { world: freshWorld(), management: undefined };
      useGame.setState({
        world: b.world,
        management: b.management,
        loading: false,
        viewHour: b.world.settings.atmosphere.hour,
        viewWeather: b.world.settings.atmosphere.weather,
      });
      if (value) await save();
    } catch (error) {
      useGame.setState({
        loading: false,
        loadError: message(error),
        saveState: "error",
        saveError:
          "The existing save was left untouched. Import a valid backup or deliberately reset.",
      });
    }
  })();
  return boot;
}
function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
export async function loadVisit() {
  useGame.setState({ loading: true, loadError: "" });
  try {
    const id = location.pathname.split("/")[2];
    const response = await fetch(`/api/worlds/${encodeURIComponent(id)}`);
    const data = (await response.json()) as {
      snapshot: unknown;
      error?: string;
    };
    if (!response.ok)
      throw new Error(data.error ?? "This world could not be loaded.");
    const world = fromSnapshot(validateSnapshot(data.snapshot));
    useGame.setState({
      world,
      mode: "visitor",
      loading: false,
      viewHour: world.settings.atmosphere.hour,
      viewWeather: world.settings.atmosphere.weather,
    });
  } catch (error) {
    useGame.setState({ loading: false, loadError: message(error) });
  }
}
export function choose(item: Kind) {
  useGame.setState({ item, tool: "place", selected: null, rotation: 0 });
}
export function explore() {
  useGame.setState({ tool: "explore", selected: null });
}
function commit(objects: ObjectData[], history = true) {
  const s = useGame.getState();
  if (s.mode !== "owner") return;
  const next = advance({ ...s.world, objects });
  const gained = next.completed > s.world.completed;
  useGame.setState({
    world: next,
    ...(history
      ? { history: [...s.history, s.world.objects].slice(-80), future: [] }
      : {}),
    notice: gained
      ? next.completed === 10
        ? "Your sky castle is unlocked. Keep making this world yours!"
        : `Challenge complete — ${next.completed} discoveries made.`
      : "",
    celebrating: gained && next.completed === 10,
  });
  void save();
}
export function candidate(x: number, z: number, island: 0 | 1): ObjectData {
  const s = useGame.getState(),
    old = s.world.objects.find((o) => o.id === s.selected);
  return {
    id: s.tool === "move" && old ? old.id : crypto.randomUUID(),
    kind: s.tool === "move" && old ? old.kind : s.item,
    x,
    z,
    island,
    rotation: s.rotation,
  };
}
export function place(x: number, z: number, island: 0 | 1) {
  const s = useGame.getState();
  if (s.mode !== "owner" || s.tool === "explore") return;
  const o = candidate(x, z, island),
    error = placementError(
      s.world,
      o,
      s.tool === "move" ? (s.selected ?? undefined) : undefined,
    );
  if (error) {
    useGame.setState({ notice: error });
    return;
  }
  commit(
    s.tool === "move"
      ? s.world.objects.map((p) => (p.id === o.id ? o : p))
      : [...s.world.objects, o],
  );
  if (s.tool === "move") explore();
}
export function select(id: string) {
  if (useGame.getState().mode === "owner")
    useGame.setState({ selected: id, tool: "explore" });
}
export function moveSelected() {
  const s = useGame.getState(),
    o = s.world.objects.find((p) => p.id === s.selected);
  if (o) useGame.setState({ tool: "move", rotation: o.rotation });
}
export function rotate() {
  const s = useGame.getState();
  if (s.tool !== "explore") {
    useGame.setState({ rotation: (s.rotation + 1) % 4 });
    return;
  }
  const o = s.world.objects.find((p) => p.id === s.selected);
  if (!o) return;
  const next = { ...o, rotation: (o.rotation + 1) % 4 },
    error = placementError(s.world, next, o.id);
  if (error) {
    useGame.setState({ notice: error });
    return;
  }
  commit(s.world.objects.map((p) => (p.id === o.id ? next : p)));
}
export function remove() {
  const s = useGame.getState();
  if (s.selected) {
    commit(s.world.objects.filter((o) => o.id !== s.selected));
    explore();
    useGame.setState({ notice: "Object deleted. Undo brings it back." });
  }
}
export function undo(redo = false) {
  const s = useGame.getState(),
    source = redo ? s.future : s.history,
    last = source.at(-1);
  if (!last) return;
  commit(last, false);
  useGame.setState(
    redo
      ? {
          future: s.future.slice(0, -1),
          history: [...s.history, s.world.objects],
          selected: null,
          tool: "explore",
        }
      : {
          history: s.history.slice(0, -1),
          future: [...s.future, s.world.objects],
          selected: null,
          tool: "explore",
        },
  );
}
export function setAtmosphere(patch: Partial<Atmosphere>) {
  const s = useGame.getState(),
    a = {
      ...s.world.settings.atmosphere,
      hour: s.viewHour,
      weather: s.viewWeather,
      ...patch,
    };
  useGame.setState({
    world: { ...s.world, settings: { ...s.world.settings, atmosphere: a } },
    viewHour: a.hour,
    viewWeather: a.weather,
  });
  if (s.mode === "owner") void save();
}
export function detail(key: "shadows" | "particles", value: boolean) {
  const s = useGame.getState();
  useGame.setState({
    world: { ...s.world, settings: { ...s.world.settings, [key]: value } },
  });
  if (s.mode === "owner") void save();
}
export function tick(seconds: number) {
  const s = useGame.getState(),
    a = s.world.settings.atmosphere;
  if (a.autoTime)
    useGame.setState({ viewHour: (s.viewHour + seconds / 30) % 24 });
}
export function autoWeather() {
  const s = useGame.getState();
  if (!s.world.settings.atmosphere.autoWeather) return;
  const types: Weather[] = ["sunny", "cloudy", "rainy", "snowy"];
  const weather = types[(types.indexOf(s.viewWeather) + 1) % 4];
  useGame.setState({ viewWeather: weather });
}
export function saveViewingState() {
  const s = useGame.getState();
  if (s.mode !== "owner" || s.loading || s.loadError) return;
  useGame.setState({
    world: {
      ...s.world,
      settings: {
        ...s.world.settings,
        atmosphere: {
          ...s.world.settings.atmosphere,
          hour: s.viewHour,
          weather: s.viewWeather,
        },
      },
    },
  });
  void save();
}
export function download(
  name: string,
  data: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportBackup() {
  download(
    "floating-world-private-backup.json",
    JSON.stringify(privateBackup(), null, 2),
  );
}
export async function importBackup(file: File) {
  if (file.size > 512_000) throw new Error("Backup is too large.");
  const b = validateBackup(JSON.parse(await file.text()));
  useGame.setState({
    world: b.world,
    management: b.management,
    history: [],
    future: [],
    selected: null,
    tool: "explore",
    loadError: "",
    viewHour: b.world.settings.atmosphere.hour,
    viewWeather: b.world.settings.atmosphere.weather,
  });
  await save();
}
export async function reset() {
  const world = freshWorld();
  useGame.setState({
    world,
    history: [],
    future: [],
    selected: null,
    tool: "explore",
    loadError: "",
    viewHour: 14,
    viewWeather: "sunny",
  });
  await save();
}
export async function publication(action: "create" | "update" | "delete") {
  const s = useGame.getState();
  if (s.mode !== "owner" || s.publicationBusy) return false;
  useGame.setState({ publicationBusy: true, publicationError: "" });
  try {
    let management = s.management;
    if (action === "create" && !management) {
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      management = {
        token: Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
          "",
        ),
        requestId: crypto.randomUUID(),
      };
      useGame.setState({ management });
    }
    if (!management)
      throw new Error("No private ownership information is available.");
    if (!(await save()))
      throw new Error(
        "Save your ownership credential locally before publishing. Restore storage access, then retry.",
      );
    const a = {
      ...s.world.settings.atmosphere,
      hour: s.viewHour,
      weather: s.viewWeather,
    };
    const response = await fetch(
      action === "create"
        ? "/api/worlds"
        : `/api/worlds/${management.publicId}`,
      {
        method:
          action === "delete" ? "DELETE" : action === "update" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${management.token}`,
        },
        ...(action === "delete"
          ? {}
          : {
              body: JSON.stringify(
                action === "create"
                  ? {
                      snapshot: snapshot(s.world, a),
                      requestId: management.requestId,
                    }
                  : snapshot(s.world, a),
              ),
            }),
      },
    );
    const data = (await response.json()) as {
      publicId?: string;
      error?: string;
    };
    if (!response.ok && !(action === "delete" && response.status === 404))
      throw new Error(
        data.error ?? "Publication failed. Local edits are safe.",
      );
    if (action === "delete")
      useGame.setState({
        management: undefined,
        notice: "World unpublished. The visiting link is no longer available.",
      });
    else
      useGame.setState({
        management: {
          ...management,
          publicId: data.publicId ?? management.publicId,
        },
        notice:
          action === "create"
            ? "World published. Export a private backup to keep ownership safe."
            : "Published snapshot updated at the same link.",
      });
    await save();
    return true;
  } catch (error) {
    useGame.setState({ publicationError: message(error) });
    return false;
  } finally {
    useGame.setState({ publicationBusy: false });
  }
}

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  CloudRain,
  CloudSnow,
  Cloud,
  Sun,
  Download,
  Grid2X2,
  Hammer,
  HelpCircle,
  Move,
  MousePointer2,
  Redo2,
  RotateCw,
  Settings,
  Share2,
  Sprout,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  autoWeather,
  choose,
  detail,
  explore,
  exportBackup,
  importBackup,
  loadVisit,
  moveSelected,
  publication,
  remove,
  reset,
  rotate,
  save,
  saveViewingState,
  select,
  setAtmosphere,
  start,
  tick,
  undo,
  useGame,
} from "./store";
import {
  catalog,
  MAX_OBJECTS,
  progress,
  rewards,
  titles,
  validateBackup,
} from "./world";
import type { Kind, Weather } from "./world";
import { captureScene, WorldScene } from "./WorldScene";
import "./game.css";

function IconButton({
  label,
  onClick,
  children,
  disabled = false,
  active = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      className={`icon ${active ? "active" : ""}`}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
function ModelPreview({ kind }: { kind: Kind }) {
  const src = useGame((s) => s.previews[kind]);
  return (
    <span className="preview">
      {src ? <img src={src} alt="" draggable={false} /> : <Sprout size={25} />}
    </span>
  );
}
function Catalog() {
  const s = useGame(),
    [category, setCategory] = useState("All"),
    ref = useRef<HTMLDivElement>(null),
    [edges, setEdges] = useState({ left: false, right: false });
  const items = catalog.filter(
    (c) => category === "All" || category === c.category,
  );
  useEffect(() => {
    const el = ref.current!;
    const update = () =>
      setEdges({
        left: el.scrollLeft > 2,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
    el.scrollLeft = 0;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [category]);
  return (
    <section className="build-dock" aria-label="Building catalog">
      <div className="dock-heading">
        <strong>
          <Hammer size={15} /> Build
        </strong>
        <div className="categories">
          {["All", "Nature", "Buildings", "Details"].map((c) => (
            <button
              key={c}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`catalog-browser ${edges.left || edges.right ? "paging" : ""}`}
      >
        <IconButton
          label="Previous catalog items"
          disabled={!edges.left}
          onClick={() =>
            ref.current?.scrollBy({
              left: -ref.current.clientWidth - 8,
              behavior: "smooth",
            })
          }
        >
          <ArrowLeft size={15} />
        </IconButton>
        <div ref={ref} className="catalog-items">
          {items.map((c) => (
            <button
              key={c.kind}
              className={`catalog-item ${s.tool === "place" && s.item === c.kind ? "selected" : ""}`}
              aria-label={`Place ${c.name}`}
              aria-pressed={s.tool === "place" && s.item === c.kind}
              disabled={s.world.completed < c.unlock}
              title={
                s.world.completed < c.unlock
                  ? `Complete challenge ${c.unlock} to unlock`
                  : c.name
              }
              onClick={() => choose(c.kind)}
            >
              <ModelPreview kind={c.kind} />
              <span>{c.name}</span>
              {s.world.completed < c.unlock && (
                <small>Challenge {c.unlock}</small>
              )}
            </button>
          ))}
        </div>
        <IconButton
          label="Next catalog items"
          disabled={!edges.right}
          onClick={() =>
            ref.current?.scrollBy({
              left: ref.current.clientWidth + 8,
              behavior: "smooth",
            })
          }
        >
          <ArrowRight size={15} />
        </IconButton>
      </div>
      <div className="dock-footer">
        <button
          aria-label="Explore"
          className={`explore ${s.tool === "explore" ? "active" : ""}`}
          onClick={explore}
        >
          <MousePointer2 size={14} /> Select & edit
        </button>
        <i />
        <IconButton
          label="Undo"
          disabled={!s.history.length}
          onClick={() => undo()}
        >
          <Undo2 size={15} />
        </IconButton>
        <IconButton
          label="Redo"
          disabled={!s.future.length}
          onClick={() => undo(true)}
        >
          <Redo2 size={15} />
        </IconButton>
        {s.tool !== "explore" && (
          <>
            <i />
            <IconButton label="Rotate placement" onClick={rotate}>
              <RotateCw size={15} />
            </IconButton>
            <IconButton
              label="Toggle grid"
              active={s.grid}
              onClick={() => s.patch({ grid: !s.grid })}
            >
              <Grid2X2 size={15} />
            </IconButton>
          </>
        )}
        <span className="instruction">
          {s.tool === "explore"
            ? "Click an object to move, rotate, or delete it."
            : s.tool === "move"
              ? "Click a valid spot to move. Escape cancels."
              : `${catalog.find((c) => c.kind === s.item)?.name} · Click empty grass to place`}
        </span>
        <span className="save-status" role="status">
          {s.saveState === "saving"
            ? "Saving…"
            : s.saveState === "error"
              ? "Not saved"
              : "Saved locally"}
        </span>
      </div>
    </section>
  );
}
function Challenge() {
  const s = useGame(),
    [open, setOpen] = useState(false),
    p = progress(s.world, s.selected ?? undefined),
    done = p.requirements.filter((r) => r.count >= r.target).length,
    next = p.requirements.find((r) => r.count < r.target);
  return (
    <aside className="journey">
      <button
        aria-label="Current challenge details"
        aria-expanded={open}
        className="challenge-summary"
        onClick={() => setOpen(!open)}
      >
        <span className="eyebrow">
          {s.world.completed === 10
            ? "YOUR WORLD, YOUR WAY"
            : `CHALLENGE ${s.world.completed + 1} / 10`}
          <span>
            {s.world.completed === 10
              ? "Complete"
              : `${done} of ${p.requirements.length} goals`}
          </span>
        </span>
        <strong>
          {titles[s.world.completed] ?? "A world to call your own"}
          <ChevronDown size={14} />
        </strong>
        <span className="next-goal">
          {next
            ? `Next: ${next.label} · ${next.count}/${next.target}`
            : "Keep creating. Every item is unlocked."}
        </span>
        <span className="progress">
          <span
            style={{
              width: `${s.world.completed === 10 ? 100 : (done / Math.max(p.requirements.length, 1)) * 100}%`,
            }}
          />
        </span>
      </button>
      {open && (
        <div className="challenge-details">
          {p.requirements.map((r) => (
            <div key={r.label}>
              <Check size={13} opacity={r.count >= r.target ? 1 : 0.2} />
              <span>{r.label}</span>
              <strong>
                {Math.min(r.count, r.target)}/{r.target}
              </strong>
            </div>
          ))}
          <p>
            {s.world.completed < 10
              ? `Next discovery: ${rewards[s.world.completed]}`
              : "All ten challenges complete."}
          </p>
          {p.area.length > 0 && (
            <small>
              The gold cells mark the accepted area around one target. Select a
              different cottage or pond to inspect its area.
            </small>
          )}
        </div>
      )}
    </aside>
  );
}
function WeatherIcon({ weather }: { weather: Weather }) {
  const Icon =
    weather === "rainy"
      ? CloudRain
      : weather === "snowy"
        ? CloudSnow
        : weather === "cloudy"
          ? Cloud
          : Sun;
  return <Icon size={18} />;
}
function AtmospherePanel() {
  const s = useGame(),
    a = s.world.settings.atmosphere;
  return (
    <>
      <h2>Set the mood</h2>
      <p>Weather and time change the view. Your world is always safe.</p>
      <div className="weather-options">
        {(["sunny", "cloudy", "rainy", "snowy"] as Weather[]).map((w) => (
          <button
            aria-pressed={s.viewWeather === w && !a.autoWeather}
            key={w}
            onClick={() =>
              setAtmosphere({
                weather: w,
                autoWeather: false,
                hour: s.viewHour,
              })
            }
          >
            <WeatherIcon weather={w} />
            {w}
          </button>
        ))}
      </div>
      <label className="check-row">
        <input
          type="checkbox"
          checked={a.autoWeather}
          onChange={(e) =>
            setAtmosphere({
              autoWeather: e.target.checked,
              weather: s.viewWeather,
              hour: s.viewHour,
            })
          }
        />
        Automatic weather
      </label>
      <label className="time-label">
        Time of day{" "}
        <strong>{String(Math.floor(s.viewHour)).padStart(2, "0")}:00</strong>
        <input
          aria-label="Time of day"
          type="range"
          min="0"
          max="23"
          value={s.viewHour}
          onChange={(e) =>
            setAtmosphere({ hour: Number(e.target.value), autoTime: false })
          }
        />
      </label>
      <div className="time-presets">
        {[
          ["Day", 14],
          ["Dusk", 18],
          ["Night", 23],
        ].map(([label, hour]) => (
          <button
            key={label}
            onClick={() =>
              setAtmosphere({ hour: Number(hour), autoTime: false })
            }
          >
            {label}
          </button>
        ))}
      </div>
      <label className="check-row">
        <input
          type="checkbox"
          checked={a.autoTime}
          onChange={(e) =>
            setAtmosphere({ autoTime: e.target.checked, hour: s.viewHour })
          }
        />
        Automatic day/night
      </label>
    </>
  );
}
function SettingsPanel({
  confirm,
}: {
  confirm: (action: "reset" | File) => void;
}) {
  const s = useGame(),
    [error, setError] = useState("");
  return (
    <>
      <h2>Your world</h2>
      <label className="field">
        World name
        <input
          value={s.world.name}
          maxLength={40}
          onChange={(e) => {
            const name = e.target.value || "My world";
            s.patch({ world: { ...s.world, name } });
            void save();
          }}
        />
      </label>
      <p aria-label="Placed objects">
        {s.world.objects.length} objects · {MAX_OBJECTS} maximum
      </p>
      <label className="check-row">
        <input
          type="checkbox"
          checked={s.world.settings.shadows}
          onChange={(e) => detail("shadows", e.target.checked)}
        />
        Soft shadows
      </label>
      <label className="check-row">
        <input
          type="checkbox"
          checked={s.world.settings.particles}
          onChange={(e) => detail("particles", e.target.checked)}
        />
        Weather particles
      </label>
      <hr />
      <h3>Keep a private backup</h3>
      <p>
        A backup includes publication ownership when available. Keep it private:
        anyone with it may manage your publication. Losing both browser data and
        your backup means losing that access.
      </p>
      <button className="secondary" onClick={exportBackup}>
        <Download size={15} /> Export private backup
      </button>
      <label className="import-button">
        Import backup
        <input
          aria-label="Import backup"
          type="file"
          accept="application/json,.json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              if (file.size > 512_000) throw new Error("Backup is too large.");
              validateBackup(JSON.parse(await file.text()));
              setError("");
              confirm(file);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Invalid backup.");
            }
          }}
        />
      </label>
      <button className="text-danger" onClick={() => confirm("reset")}>
        Reset world…
      </button>
      {error && <p role="alert">{error}</p>}
      {s.saveError && (
        <>
          <p role="alert">{s.saveError}</p>
          <button onClick={() => void save()}>Retry local save</button>
        </>
      )}
    </>
  );
}
function SharingPanel({ requestDelete }: { requestDelete: () => void }) {
  const s = useGame(),
    id = s.management?.publicId,
    url = id ? `${location.origin}/world/${id}` : "";
  return (
    <>
      <h2>A little world, shared</h2>
      <p>
        Publish a read-only snapshot. Ordinary edits stay local until you
        explicitly update it.
      </p>
      <p className="ownership-note">
        No account is needed. Your private backup holds your ownership key; the
        visiting link cannot recover it. Export a backup after publishing.
      </p>
      {id ? (
        <>
          <label className="field">
            Visiting link
            <input aria-label="Visiting link" readOnly value={url} />
          </label>
          <a target="_blank" rel="noreferrer" href={url}>
            Visit published world ↗
          </a>
          <button
            className="primary"
            disabled={s.publicationBusy}
            onClick={() => void publication("update")}
          >
            Update published snapshot
          </button>
          <button
            className="secondary"
            onClick={() => {
              navigator.clipboard
                .writeText(url)
                .then(() => s.patch({ notice: "Visiting link copied." }))
                .catch(() =>
                  s.patch({
                    notice: "Select and copy the visiting link above.",
                  }),
                );
            }}
          >
            Copy visiting link
          </button>
          <button
            className="text-danger"
            disabled={s.publicationBusy}
            onClick={requestDelete}
          >
            Unpublish world…
          </button>
        </>
      ) : (
        <button
          className="primary"
          disabled={s.publicationBusy || s.saveState === "error"}
          onClick={() => void publication("create")}
        >
          {s.publicationBusy ? "Publishing…" : "Publish snapshot"}
        </button>
      )}
      <button className="secondary" onClick={exportBackup}>
        Export private backup
      </button>
      {s.publicationError && (
        <p role="alert">
          {s.publicationError} Your local world is safe. Retry when the service
          is available.
        </p>
      )}
    </>
  );
}
export function Game() {
  const s = useGame(),
    [panel, setPanel] = useState(""),
    [shot, setShot] = useState(false),
    [confirmation, setConfirmation] = useState<
      "reset" | "delete" | File | null
    >(null),
    [actionError, setActionError] = useState(""),
    [dismissLoadError, setDismissLoadError] = useState(false);
  const supported = useState(() => {
    const c = document.createElement("canvas"),
      gl = c.getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  })[0];
  useEffect(() => {
    void start();
    const clock = setInterval(() => tick(1), 1000),
      weather = setInterval(autoWeather, 60_000),
      checkpoint = setInterval(saveViewingState, 30_000);
    return () => {
      clearInterval(clock);
      clearInterval(weather);
      clearInterval(checkpoint);
    };
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !confirmation &&
        !shot &&
        !(
          e.target instanceof HTMLElement &&
          e.target.closest("input,textarea,[contenteditable=true]")
        ) &&
        useGame.getState().mode === "owner" &&
        useGame.getState().tool === "explore" &&
        useGame.getState().selected
      ) {
        e.preventDefault();
        remove();
        return;
      }
      if (e.key === "Escape") {
        if (confirmation) {
          setConfirmation(null);
          return;
        }
        explore();
        setPanel("");
        setShot(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [confirmation, shot]);
  useEffect(() => {
    if (!s.notice) return;
    const t = setTimeout(
      () => s.patch({ notice: "", celebrating: false }),
      4500,
    );
    return () => clearTimeout(t);
  }, [s.notice]);
  const selected = s.world.objects.find((o) => o.id === s.selected);
  if (s.loading)
    return (
      <main className="loading">
        <Sprout />
        <h1>Finding your little world…</h1>
      </main>
    );
  if (s.mode === "visitor" && s.loadError)
    return (
      <main className="loading">
        <h1>This world is unavailable</h1>
        <p role="alert">{s.loadError}</p>
        <button onClick={() => void loadVisit()}>Try again</button>
        <a href="/">Return to your world</a>
      </main>
    );
  function toggle(name: string) {
    setPanel(panel === name ? "" : name);
  }
  return (
    <main
      className={`game ${shot ? "framing" : ""} ${s.viewHour < 6 || s.viewHour >= 20 ? "night" : ""}`}
    >
      <div className="world-frame">
        {supported ? (
          <WorldScene clean={shot} />
        ) : (
          <div className="graphics-error">
            <h1>This browser needs WebGL 2</h1>
            <p>
              Enable hardware acceleration or try a current desktop browser.
              Your saved world remains safe.
            </p>
          </div>
        )}
      </div>
      {!shot && (
        <>
          <header>
            <div className="identity">
              <span>
                <Sprout size={23} />
              </span>
              <div>
                <small>
                  {s.mode === "visitor"
                    ? "SHARED FLOATING WORLD"
                    : "FLOATING WORLD"}
                </small>
                <strong>{s.world.name}</strong>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="weather-trigger"
                aria-label="Atmosphere settings"
                aria-expanded={panel === "weather"}
                onClick={() => toggle("weather")}
              >
                <WeatherIcon weather={s.viewWeather} />
                <span className="weather-name">{s.viewWeather}</span>
                <span>
                  {String(Math.floor(s.viewHour)).padStart(2, "0")}:00
                </span>
                <ChevronDown size={12} />
              </button>
              <IconButton
                label="Screenshot mode"
                onClick={() => {
                  setShot(true);
                  setPanel("");
                }}
              >
                <Camera size={17} />
              </IconButton>
              {s.mode === "owner" ? (
                <>
                  <IconButton
                    label="World settings"
                    onClick={() => toggle("settings")}
                  >
                    <Settings size={17} />
                  </IconButton>
                  <button className="primary" onClick={() => toggle("share")}>
                    <Share2 size={14} /> Share world
                  </button>
                </>
              ) : (
                <a className="primary" href="/">
                  Your world
                </a>
              )}
            </div>
          </header>
          {s.mode === "owner" && (
            <>
              <Challenge />
              <Catalog />
              {selected && (
                <div className="selection">
                  <ModelPreview kind={selected.kind} />
                  <strong>
                    {catalog.find((c) => c.kind === selected.kind)?.name}
                  </strong>
                  <button
                    className="edit-action"
                    aria-label="Move selected object"
                    onClick={moveSelected}
                  >
                    <Move size={15} /> Move
                  </button>
                  <button
                    className="edit-action"
                    aria-label="Rotate selected object"
                    onClick={rotate}
                  >
                    <RotateCw size={15} /> Rotate
                  </button>
                  <button
                    className="edit-action delete-action"
                    aria-label="Delete selected object"
                    onClick={remove}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                  <IconButton
                    label="Deselect object"
                    onClick={() => select("")}
                  >
                    <X size={15} />
                  </IconButton>
                </div>
              )}
            </>
          )}
          {panel && panel !== "help" && (
            <aside className="panel" aria-label={`${panel} controls`}>
              <IconButton label="Close panel" onClick={() => setPanel("")}>
                <X size={16} />
              </IconButton>
              {panel === "weather" ? (
                <AtmospherePanel />
              ) : panel === "settings" ? (
                <SettingsPanel confirm={setConfirmation} />
              ) : (
                <SharingPanel requestDelete={() => setConfirmation("delete")} />
              )}
            </aside>
          )}
          <button
            className="help-trigger"
            aria-label="Camera controls"
            onClick={() => toggle("help")}
          >
            <HelpCircle size={15} /> Controls
          </button>
          {panel === "help" && (
            <aside className="help-panel">
              <h2>Take your time</h2>
              <p>Drag to orbit · Right-drag to pan · Scroll to zoom.</p>
              <p>
                Choose an unlocked item, then click grass to place. Choose
                Select & edit, then click an object. Its toolbar has Move,
                Rotate, and Delete. Delete or Backspace also removes the
                selected object; Undo restores it. Escape cancels a move or
                returns to Select & edit.
              </p>
            </aside>
          )}
          {s.saveError && s.mode === "owner" && (
            <div className="save-warning" role="alert">
              {s.saveError}
              <button onClick={exportBackup}>Export backup</button>
              <button onClick={() => void save()}>Retry save</button>
            </div>
          )}
        </>
      )}
      {shot && (
        <>
          <div className="framing-label">A moment worth keeping</div>
          <div className="capture-actions">
            <button onClick={() => setShot(false)}>
              <ArrowLeft size={15} /> Back to world
            </button>
            <button className="primary" onClick={captureScene}>
              <Camera size={16} /> Capture PNG
            </button>
          </div>
        </>
      )}
      {s.notice && (
        <div
          className={`toast ${s.celebrating ? "celebration" : ""}`}
          role="status"
        >
          {s.notice}
        </div>
      )}
      {(confirmation ||
        (s.loadError && !dismissLoadError && s.mode === "owner")) && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Confirm world action"
          >
            <h2>
              {confirmation === "delete"
                ? "Unpublish this world?"
                : confirmation === "reset"
                  ? "Start a fresh island?"
                  : confirmation
                    ? "Replace your local world?"
                    : "Your save needs attention"}
            </h2>
            <p>
              {confirmation === "delete"
                ? "The public link will stop working. Your local world stays here."
                : s.loadError ||
                  "Export a private backup first if you want to keep this world. Publication ownership is retained when resetting; importing uses the backup’s ownership information."}
            </p>
            <button className="secondary" onClick={exportBackup}>
              Export backup first
            </button>
            <div className="confirm-actions">
              <button
                onClick={() => {
                  setConfirmation(null);
                  setDismissLoadError(true);
                }}
              >
                Cancel
              </button>
              <button
                className="primary"
                disabled={s.publicationBusy}
                onClick={async () => {
                  try {
                    if (confirmation === "delete") {
                      if (!(await publication("delete"))) {
                        setConfirmation(null);
                        setPanel("share");
                        return;
                      }
                    } else if (confirmation === "reset" || !confirmation)
                      await reset();
                    else await importBackup(confirmation);
                    setConfirmation(null);
                    setPanel("");
                    setActionError("");
                  } catch (e) {
                    setActionError(
                      e instanceof Error ? e.message : "Action failed.",
                    );
                  }
                }}
              >
                Confirm{" "}
                {confirmation === "delete"
                  ? "unpublish"
                  : confirmation instanceof File
                    ? "import"
                    : "reset"}
              </button>
            </div>
            {actionError && <p role="alert">{actionError}</p>}
          </section>
        </div>
      )}
    </main>
  );
}

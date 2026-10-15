import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const root = createRoot(document.getElementById('root')!);

function ScaffoldHome() {
  return (
    <main className="scaffold-home">
      <img src="/favicon.svg" width="76" height="76" alt="A little floating island" />
      <p className="scaffold-eyebrow">A LITTLE ROOM FOR WONDER</p>
      <h1>Floating World</h1>
      <p>The foundation is ready.<br />A little world is on its way.</p>
      <div className="scaffold-tags"><span>React + TypeScript</span><span>Three.js</span><span>Cloudflare + D1</span></div>
      <small>Project scaffold · gameplay implementation follows UI review</small>
    </main>
  );
}

root.render(<StrictMode><ScaffoldHome /></StrictMode>);

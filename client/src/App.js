import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function JapanOutline() {
  return (
    <img
      src="/images/japan.jpg"
      alt="Japan map"
      className="japan-image"
      onError={(e) => {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IGZpbGw9IiMzYjgyZjYiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz48L3BhdHRlcm4+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzAiIGZpbGw9InVybCgjYSkiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==';
      }}
    />
  );
}

function LeftPanel({ onGenerate }) {
  const [pressing, setPressing] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = async (e) => {
    setPressing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 800);
    await onGenerate();
    setTimeout(() => setPressing(false), 150);
  };

  return (
    <div className="panel panel-left">
      <div className="japan-container">
        <JapanOutline />
      </div>
      <button
        className={`footstep-btn ${pressing ? 'pressing' : ''}`}
        onClick={handleClick}
        aria-label="Generate electricity"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
        ))}
        <svg viewBox="0 0 48 48" className="footstep-icon" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="16" cy="28" rx="7" ry="10" fill="white" opacity="0.95"/>
          <ellipse cx="32" cy="20" rx="7" ry="10" fill="white" opacity="0.95"/>
          <circle cx="12" cy="20" r="2.5" fill="white" opacity="0.8"/>
          <circle cx="17" cy="18" r="2" fill="white" opacity="0.8"/>
          <circle cx="22" cy="19" r="2" fill="white" opacity="0.8"/>
          <circle cx="28" cy="32" r="2.5" fill="white" opacity="0.8"/>
          <circle cx="33" cy="30" r="2" fill="white" opacity="0.8"/>
          <circle cx="38" cy="31" r="2" fill="white" opacity="0.8"/>
        </svg>
      </button>
      <p className="btn-label">Click to generate electricity</p>
    </div>
  );
}

const INSTAGRAM_EMBED_URL = 'https://www.instagram.com/reel/DU_o1n_ElVE/embed';

function CenterPanel() {
  return (
    <div className="panel panel-center">
      <div className="instagram-embed-wrapper">
        <iframe
          src={INSTAGRAM_EMBED_URL}
          title="Instagram Reel"
          className="instagram-iframe"
          scrolling="no"
          allowTransparency="true"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
        />
      </div>
    </div>
  );
}

function RightPanel({ electricity, pulse }) {
  return (
    <div className="panel panel-right">
      <div className="right-header">
        <span className="bolt-icon">⚡</span>
        <h2 className="right-title">Electricity Generated</h2>
      </div>
      <div className={`electricity-card ${pulse ? 'pulse' : ''}`}>
        <div className="electricity-value">
          <span className="elec-number">{electricity}</span>
          <span className="elec-bolt">⚡</span>
        </div>
      </div>
      <div className="quote-section">
        <p className="quote-text">
          Japan🇯🇵 is turning footsteps into electricity! Using piezoelectric tiles, every step you take generates a small amount of energy. Millions of steps together can power LED lights and displays in busy places like Shibuya Station. A brilliant way to create a sustainable and smart city.
        </p>
      </div>
      <div className="images-row">
        <img src="/images/shocked.png" alt="Shocked face" className="reaction-image" onError={(e) => { e.target.style.display = 'none'; }} />
        <img src="/images/red-arrow.png" alt="Red arrow pointing up" className="reaction-image" />
      </div>
    </div>
  );
    
}

const API = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:4000';

export default function App() {
  const [electricity, setElectricity] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    fetch(`${API}/electricity`)
      .then(r => r.json())
      .then(d => setElectricity(d.electricity))
      .catch(console.error);
  }, []);

  const handleGenerate = useCallback(async () => {
    try {
      const res = await fetch(`${API}/generate`, { method: 'POST' });
      const data = await res.json();
      setElectricity(data.electricity);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="app">
      <div className="noise-overlay" />
      <LeftPanel onGenerate={handleGenerate} />
      <CenterPanel />
      <RightPanel electricity={electricity} pulse={pulse} />
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function JapanOutline() {
  return (
    <svg viewBox="0 0 120 200" className="japan-svg" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M72,8 L78,14 L82,22 L80,30 L74,36 L70,44 L72,52 L68,60 L62,66 L58,74 L56,82 L60,90 L64,98 L66,108 L62,118 L58,126 L54,134 L52,144 L56,152 L60,160 L58,168 L54,176 L50,184 L46,190 L42,196 L36,196 L32,188 L30,178 L34,168 L38,158 L36,148 L32,138 L28,128 L26,118 L30,108 L34,98 L30,88 L26,78 L28,68 L34,60 L38,50 L40,40 L36,30 L38,20 L44,12 L52,8 L62,6 Z"
        fill="none"
        stroke="rgba(100,160,255,0.5)"
        strokeWidth="1.5"
        className="japan-path"
      />
      <circle cx="48" cy="80" r="2" fill="rgba(100,160,255,0.4)" />
      <text x="44" y="76" fontSize="6" fill="rgba(100,160,255,0.5)" fontFamily="monospace">東京</text>
    </svg>
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
        <div className="japan-label">日本</div>
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

function CenterPanel() {
  return (
    <div className="panel panel-center">
      <div className="video-card">
        <div className="video-thumbnail">
          <div className="video-bg-gradient" />
          <div className="feet-visual">
            <span className="feet-emoji">👣</span>
          </div>
          <button className="play-btn" aria-label="Play video">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        <div className="video-footer">
          <div className="video-info">
            <div className="channel-row">
              <div className="avatar" />
              <span className="channel-name">@japan_energy_tech</span>
            </div>
            <h3 className="video-title">Footsteps → Electricity</h3>
            <p className="video-subtitle">Kinetic energy conversion demo</p>
            <p className="video-desc">Turning footsteps into electricity in Tokyo 🇯🇵⚡</p>
          </div>
          <div className="social-icons">
            <div className="social-btn">
              <span className="social-icon">❤️</span>
              <span className="social-count">128K</span>
            </div>
            <div className="social-btn">
              <span className="social-icon">💬</span>
              <span className="social-count">2.4K</span>
            </div>
            <div className="social-btn">
              <span className="social-icon">🔗</span>
              <span className="social-count">Share</span>
            </div>
          </div>
        </div>
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
        <div className="card-top-row">
          <span className="active-dot" />
          <span className="active-label">ACTIVE</span>
        </div>
        <div className="electricity-value">
          <span className="elec-number">{electricity}</span>
          <span className="elec-bolt">⚡</span>
        </div>
        <div className="unit-label">kilowatt steps</div>
      </div>
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-num">{Math.floor(electricity * 0.003 * 100) / 100}</div>
          <div className="stat-lbl">kWh total</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-num">{electricity > 0 ? '🟢' : '⚫'}</div>
          <div className="stat-lbl">grid status</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [electricity, setElectricity] = useState(0);
  const [pulse, setPulse] = useState(false);

  const API = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';

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

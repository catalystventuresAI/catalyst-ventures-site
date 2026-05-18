/* =========================================================
   Catalyst Ventures — Shared scripts (nav, network animation)
   ========================================================= */

// Mobile nav toggle
(function() {
  const btn = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
  });
})();

// Animated ecosystem network — canvas
// Renders a constellation of labeled nodes (AI companies, enterprise,
// government, investment, talent, etc.) with subtle drift and connection lines.
function initNetwork(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

  // Categorized nodes — concept clusters
  const clusters = [
    { label: 'ENTERPRISE',    color: '#6ba2ff', x: 0.20, y: 0.42, items: ['Banking', 'Energy', 'Healthcare', 'Manufacturing'] },
    { label: 'AI COMPANIES',  color: '#6ee7d3', x: 0.55, y: 0.30, items: ['Startups', 'Platforms', 'Agentic', 'Models'] },
    { label: 'PUBLIC SECTOR', color: '#9c8cff', x: 0.78, y: 0.55, items: ['Policy', 'Procurement', 'Programs'] },
    { label: 'CAPITAL',       color: '#c6cbd6', x: 0.35, y: 0.78, items: ['VC', 'Strategic', 'Growth'] },
    { label: 'TALENT',        color: '#6ba2ff', x: 0.68, y: 0.82, items: ['Research', 'Engineering', 'Executive'] },
  ];

  const nodes = [];
  // Central hub
  nodes.push({ cx: 0.48, cy: 0.55, r: 6, label: 'CATALYST', color: '#ffffff', isHub: true, vx: 0, vy: 0 });

  clusters.forEach((cluster, ci) => {
    // Cluster anchor (visible labeled)
    nodes.push({
      cx: cluster.x, cy: cluster.y, r: 3.6,
      label: cluster.label, color: cluster.color,
      isAnchor: true, clusterId: ci,
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
    });
    // Surrounding items
    cluster.items.forEach((item, i) => {
      const angle = (i / cluster.items.length) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 0.07 + Math.random() * 0.05;
      nodes.push({
        cx: cluster.x + Math.cos(angle) * dist,
        cy: cluster.y + Math.sin(angle) * dist * 0.8,
        r: 1.8 + Math.random() * 0.8,
        label: item,
        color: cluster.color,
        clusterId: ci,
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        phase: Math.random() * Math.PI * 2,
      });
    });
  });

  // Pre-computed edge list (hub -> anchor; anchor -> items)
  const edges = [];
  for (let i = 1; i < nodes.length; i++) {
    if (nodes[i].isAnchor) {
      edges.push({ a: 0, b: i, strength: 1 });
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].isAnchor && nodes[i].clusterId !== undefined) {
      // find that cluster's anchor
      const anchorIdx = nodes.findIndex(n => n.isAnchor && n.clusterId === nodes[i].clusterId);
      if (anchorIdx >= 0) edges.push({ a: anchorIdx, b: i, strength: 0.7 });
    }
  }
  // A few cross-cluster ties for richness
  const cross = [[1,3],[3,5],[5,7],[7,9],[1,5],[3,9]];
  cross.forEach(([a, b]) => {
    if (nodes[a] && nodes[b]) edges.push({ a, b, strength: 0.25, dashed: true });
  });

  // Pulse packets traveling along edges (data flow)
  const pulses = [];
  for (let i = 0; i < 12; i++) {
    const edge = edges[Math.floor(Math.random() * edges.length)];
    pulses.push({ edge, t: Math.random(), speed: 0.0015 + Math.random() * 0.002 });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    // Clamp to sane bounds — protects against runaway resize loops
    W = Math.max(1, Math.min(4096, rect.width));
    H = Math.max(1, Math.min(4096, rect.height));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function px(n) { return n.cx * W; }
  function py(n) { return n.cy * H; }

  let t0 = performance.now();
  let raf;

  function frame(now) {
    const dt = Math.min(60, now - t0);
    t0 = now;
    ctx.clearRect(0, 0, W, H);

    // Drift nodes (small organic motion)
    nodes.forEach(n => {
      if (n.isHub) return;
      n.cx += n.vx * dt;
      n.cy += n.vy * dt;
      // bounce-ish around their cluster center
      const cluster = clusters[n.clusterId];
      if (cluster) {
        const dx = n.cx - cluster.x;
        const dy = n.cy - cluster.y;
        const drift = Math.sqrt(dx*dx + dy*dy);
        if (drift > 0.13) {
          n.vx -= dx * 0.0000008 * dt;
          n.vy -= dy * 0.0000008 * dt;
        }
      }
    });

    // Edges
    edges.forEach(e => {
      const A = nodes[e.a], B = nodes[e.b];
      ctx.beginPath();
      ctx.moveTo(px(A), py(A));
      ctx.lineTo(px(B), py(B));
      ctx.strokeStyle = `rgba(140,170,220,${0.08 * e.strength})`;
      ctx.lineWidth = 1;
      if (e.dashed) ctx.setLineDash([3, 5]);
      else ctx.setLineDash([]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Pulses along edges
    pulses.forEach(p => {
      p.t += p.speed * dt;
      if (p.t >= 1) {
        p.t = 0;
        p.edge = edges[Math.floor(Math.random() * edges.length)];
        p.speed = 0.0015 + Math.random() * 0.002;
      }
      const A = nodes[p.edge.a], B = nodes[p.edge.b];
      const x = (px(A) + (px(B) - px(A)) * p.t);
      const y = (py(A) + (py(B) - py(A)) * p.t);
      const grd = ctx.createRadialGradient(x, y, 0, x, y, 8);
      grd.addColorStop(0, 'rgba(110,231,211,0.85)');
      grd.addColorStop(1, 'rgba(110,231,211,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nodes
    nodes.forEach(n => {
      const x = px(n), y = py(n);
      // glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, n.r * 5);
      glow.addColorStop(0, n.color + '88');
      glow.addColorStop(1, n.color + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, n.r * 5, 0, Math.PI * 2);
      ctx.fill();
      // node
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI * 2);
      ctx.fill();

      // Labels — only for hub & anchors
      if (n.isHub || n.isAnchor) {
        ctx.fillStyle = n.isHub ? '#ffffff' : 'rgba(245,247,252,0.65)';
        ctx.font = `500 ${n.isHub ? 11 : 9.5}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, x, y - n.r - 8);
      }
    });

    raf = requestAnimationFrame(frame);
  }

  resize();
  raf = requestAnimationFrame(frame);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Pause when not visible (perf)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !raf) {
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
  });
  io.observe(canvas);
}

window.initNetwork = initNetwork;

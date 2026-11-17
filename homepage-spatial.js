/* Spatial layer for the homepage: the hero network and the workflow scene on the
   process band. Progressive enhancement only. The page reads and works without it.
   Scenes restored from the pre-17-November homepage and adapted to the simpler page. */

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.min.js';
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pinQuery = window.matchMedia('(min-width: 901px) and (min-height: 620px)');

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => (value = value * 16807 % 2147483647) / 2147483647;
}

function resizeRenderer(renderer, camera, canvas) {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
  if (canvas.width !== Math.floor(width * pixelRatio) || canvas.height !== Math.floor(height * pixelRatio)) {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

/* Run a frame callback only while the element is near the viewport and the tab is visible. */
function createLoop(element, frame) {
  let visible = false;
  let running = false;
  const tick = (time) => {
    if (!visible || document.hidden) { running = false; return; }
    frame(time);
    requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    requestAnimationFrame(tick);
  };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }, { rootMargin: '160px' }).observe(element);
  document.addEventListener('visibilitychange', start);
}

/* Scroll progress through the process band, and the step it corresponds to. */
function createStory() {
  const band = document.getElementById('process');
  const list = document.getElementById('processSteps');
  if (!band || !list) return null;
  const steps = [...list.children];
  let lastActive = -1;
  return {
    band,
    progress() {
      const rect = band.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (pinQuery.matches) return clamp(-rect.top / Math.max(1, band.offsetHeight - viewport));
      /* Unpinned: begin once the scene is in view, finish as the last step arrives. */
      return clamp((viewport * 0.4 - rect.top) / Math.max(viewport * 0.45, rect.height - viewport * 0.55));
    },
    apply(progress) {
      const active = progress < 0.3 ? 0 : progress < 0.72 ? 1 : 2;
      list.style.setProperty('--flow-progress', progress.toFixed(4));
      if (active === lastActive) return;
      lastActive = active;
      steps.forEach((step, index) => {
        step.classList.toggle('is-active', index === active);
        step.classList.toggle('is-done', index < active);
      });
    },
    goLive() { band.classList.add('is-live'); }
  };
}

function initHeroScene(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 17);
  const halfHeight = Math.tan(THREE.MathUtils.degToRad(19)) * 17;

  const group = new THREE.Group();
  group.rotation.set(-0.12, -0.28, -0.06);
  scene.add(group);

  const random = seededRandom(776);
  const count = 66;
  const positions = [];
  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 1.2 + random() * 5.3;
    const height = (random() - 0.5) * 8.5;
    positions.push(new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius * 0.72));
  }

  const nodeGeometry = new THREE.SphereGeometry(0.085, 14, 14);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x66ffe0, transparent: true, opacity: 0.76 });
  positions.forEach((position, index) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
    node.position.copy(position);
    node.scale.setScalar(index % 9 === 0 ? 2.25 : index % 4 === 0 ? 1.4 : 1);
    node.material.opacity = index % 9 === 0 ? 1 : 0.52 + random() * 0.35;
    if (index % 19 === 0) node.material.color.setHex(0xff8c73);
    else if (index % 17 === 0) node.material.color.setHex(0xffc857);
    else if (index % 13 === 0) node.material.color.setHex(0x8b7cff);
    else if (index % 11 === 0) node.material.color.setHex(0x66c7ff);
    group.add(node);
  });

  const linePositions = [];
  for (let i = 0; i < count; i += 1) {
    const next = (i + 1 + Math.floor(random() * 6)) % count;
    linePositions.push(positions[i].x, positions[i].y, positions[i].z, positions[next].x, positions[next].y, positions[next].z);
    if (i % 3 === 0) {
      const cross = (i + 17) % count;
      linePositions.push(positions[i].x, positions[i].y, positions[i].z, positions[cross].x, positions[cross].y, positions[cross].z);
    }
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x66ffe0, transparent: true, opacity: 0.15 })));

  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  createLoop(canvas, (time) => {
    resizeRenderer(renderer, camera, canvas);
    /* Keep the network on the right of wide heroes and nearer the centre of narrow ones. */
    group.position.x = Math.min(halfHeight * camera.aspect * 0.42, 9);
    group.rotation.y += ((-0.28 + pointerX * 0.13 + time * 0.000025) - group.rotation.y) * 0.025;
    group.rotation.x += ((-0.12 + pointerY * 0.08) - group.rotation.x) * 0.025;
    group.position.y = 0.1 + Math.sin(time * 0.00035) * 0.12;
    renderer.render(scene, camera);
  });
  canvas.classList.add('is-ready');
}

function buildStagePositions(THREE, count) {
  const random = seededRandom(1776);
  const stages = Array.from({ length: 5 }, () => []);
  for (let i = 0; i < count; i += 1) {
    const cluster = i % 4;
    const angle = random() * Math.PI * 2;
    const radius = 0.4 + random() * 2.8;
    stages[0].push(new THREE.Vector3((cluster - 1.5) * 2.5 + Math.cos(angle) * radius, (random() - 0.5) * 8 + Math.sin(angle) * radius, (random() - 0.5) * 5));
    const band = i % 3;
    const rank = Math.floor(i / 3);
    stages[1].push(new THREE.Vector3((band - 1) * 3.4 + (random() - 0.5) * 0.65, -5 + rank * 0.62 + (random() - 0.5) * 0.38, (random() - 0.5) * 1.2));
    const lane = i % 4;
    const laneRank = Math.floor(i / 4);
    stages[2].push(new THREE.Vector3((lane - 1.5) * 2.05, -5 + laneRank * 0.82, Math.sin(laneRank * 0.75 + lane) * 0.45));
    const column = i % 6;
    const row = Math.floor(i / 6);
    stages[3].push(new THREE.Vector3((column - 2.5) * 1.55, -4.8 + row * 1.36, (column === 2 || column === 3) ? 0.45 : -0.1));
    const finalColumn = i % 8;
    const finalRow = Math.floor(i / 8);
    stages[4].push(new THREE.Vector3((finalColumn - 3.5) * 1.15, -3.7 + finalRow * 1.48, Math.sin(finalColumn * 0.8) * 0.18));
  }
  return stages;
}

function initFlowScene(THREE, canvas, story) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 18);

  const group = new THREE.Group();
  group.rotation.set(-0.08, 0.12, -0.03);
  scene.add(group);

  const count = 48;
  const stages = buildStagePositions(THREE, count);
  const current = stages[0].map((position) => position.clone());
  const nodeGeometry = new THREE.SphereGeometry(0.13, 18, 18);
  const gateGeometry = new THREE.BoxGeometry(0.28, 0.28, 0.28);
  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    const isGate = i % 11 === 0 || i === 26;
    const isRisk = i % 13 === 0 && !isGate;
    const material = new THREE.MeshBasicMaterial({ color: isGate ? 0x053d3d : isRisk ? 0xff8c73 : 0x0a6e6e, transparent: true, opacity: isGate ? 1 : 0.82 });
    const node = new THREE.Mesh(isGate ? gateGeometry : nodeGeometry, material);
    node.position.copy(current[i]);
    node.scale.setScalar(isGate ? 1.35 : (i % 7 === 0 ? 1.65 : 1));
    node.userData = { isGate, isRisk };
    nodes.push(node);
    group.add(node);
  }

  const edgePairs = [];
  for (let i = 0; i < count - 1; i += 1) {
    edgePairs.push([i, i + 1]);
    if (i % 4 === 0 && i + 8 < count) edgePairs.push([i, i + 8]);
    if (i % 7 === 0 && i + 13 < count) edgePairs.push([i, i + 13]);
  }
  const lineArray = new Float32Array(edgePairs.length * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineArray, 3));
  const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0a6e6e, transparent: true, opacity: 0.24 }));
  lines.frustumCulled = false;
  group.add(lines);

  const travelerGeometry = new THREE.SphereGeometry(0.075, 12, 12);
  const travelers = Array.from({ length: 9 }, (_, index) => {
    const mesh = new THREE.Mesh(travelerGeometry, new THREE.MeshBasicMaterial({ color: 0x66ffe0, transparent: true }));
    mesh.userData = { edge: (index * 7) % edgePairs.length, offset: index / 9 };
    group.add(mesh);
    return mesh;
  });

  const rings = nodes.filter((node) => node.userData.isRisk).map((node) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.33, 32), new THREE.MeshBasicMaterial({ color: 0xff8c73, transparent: true, opacity: 0.32, side: THREE.DoubleSide }));
    group.add(ring);
    return { ring, node };
  });

  const palette = {
    base: new THREE.Color(0x0a6e6e),
    deep: new THREE.Color(0x053d3d),
    flow: new THREE.Color(0x0fae96),
    risk: new THREE.Color(0xff8c73),
    signal: new THREE.Color(0x2f8fd0),
    intelligence: new THREE.Color(0x6f5fe6),
    human: new THREE.Color(0xe0a021)
  };
  const setWorkflowColor = (target, progress) => {
    if (progress < 0.34) target.copy(palette.base).lerp(palette.signal, smoother(progress / 0.34));
    else if (progress < 0.66) target.copy(palette.signal).lerp(palette.intelligence, smoother((progress - 0.34) / 0.32));
    else target.copy(palette.intelligence).lerp(palette.flow, smoother((progress - 0.66) / 0.34));
  };

  let displayed = story.progress();
  let previousRaw = displayed;
  let velocity = 0;
  let previousTime = performance.now();

  createLoop(story.band, (time) => {
    resizeRenderer(renderer, camera, canvas);
    const frameSeconds = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000));
    previousTime = time;
    const raw = story.progress();
    const gap = raw - displayed;
    displayed += gap * (1 - Math.exp(-(10.5 + Math.min(16, Math.abs(gap) * 42)) * frameSeconds));
    if (Math.abs(gap) < 0.00008) displayed = raw;
    velocity = lerp(velocity, (raw - previousRaw) / frameSeconds, 1 - Math.exp(-7 * frameSeconds));
    previousRaw = raw;

    const progress = clamp(displayed);
    const stagePosition = progress * 4;
    const stage = Math.min(3, Math.floor(stagePosition));
    const stageMix = smoother(stagePosition - stage);

    for (let i = 0; i < count; i += 1) {
      current[i].lerpVectors(stages[stage][i], stages[stage + 1][i], stageMix);
      nodes[i].position.copy(current[i]);
      const { isRisk, isGate } = nodes[i].userData;
      if (isRisk) nodes[i].material.color.copy(palette.risk).lerp(palette.flow, smoother(clamp((progress - 0.5) / 0.34)));
      else if (isGate) nodes[i].material.color.copy(palette.deep).lerp(palette.human, smoother(clamp((progress - 0.48) / 0.22)));
      else setWorkflowColor(nodes[i].material.color, progress);
      nodes[i].material.opacity = isRisk && progress > 0.68 ? 0.55 : 0.88;
      if (isGate) nodes[i].rotation.set(time * 0.0004, time * 0.0006, 0);
    }

    edgePairs.forEach(([a, b], index) => {
      current[a].toArray(lineArray, index * 6);
      current[b].toArray(lineArray, index * 6 + 3);
    });
    lineGeometry.attributes.position.needsUpdate = true;
    setWorkflowColor(lines.material.color, progress);
    lines.material.opacity = lerp(0.16, 0.46, progress);

    rings.forEach(({ ring, node }, index) => {
      ring.position.copy(node.position);
      ring.lookAt(camera.position);
      ring.scale.setScalar(1 + Math.sin(time * 0.003 + index) * 0.14);
      ring.material.opacity = (1 - clamp((progress - 0.56) / 0.18)) * 0.35;
    });

    travelers.forEach((traveler) => {
      const [a, b] = edgePairs[traveler.userData.edge];
      const t = (time * lerp(0.00016, 0.00038, progress) + traveler.userData.offset) % 1;
      traveler.position.lerpVectors(current[a], current[b], t);
      setWorkflowColor(traveler.material.color, clamp(progress + 0.12));
      traveler.material.opacity = progress > 0.35 ? 1 : 0.46;
      traveler.scale.setScalar(0.75 + progress * 0.55);
    });

    const cinematic = smoother(progress);
    const fit = Math.max(1, 1.3 / camera.aspect);
    camera.position.z = lerp(18.6, 16.5, cinematic) * fit;
    camera.position.x = Math.sin(progress * Math.PI) * 0.32;
    group.scale.setScalar(lerp(0.94, 1.055, cinematic));
    group.position.x = clamp(velocity * -0.008, -0.32, 0.32);
    group.position.y = Math.sin(progress * Math.PI) * 0.24;
    group.rotation.y = 0.12 + Math.sin(time * 0.00022) * 0.055 + progress * 0.09;
    group.rotation.x = -0.08 + Math.cos(time * 0.00019) * 0.025 - progress * 0.035;

    story.apply(progress);
    renderer.render(scene, camera);
  });
  canvas.classList.add('is-ready');
  story.goLive();
}

/* Static 2D drawings for reduced motion, or when WebGL or the library is unavailable. */
function drawStatic(canvas, draw) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const render = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    draw(context, width, height);
  };
  render();
  window.addEventListener('resize', render, { passive: true });
  canvas.classList.add('is-ready');
}

function staticHero(canvas) {
  const random = seededRandom(776);
  const points = Array.from({ length: 48 }, () => ({ x: 0.42 + random() * 0.56, y: 0.06 + random() * 0.88, size: 1 + random() * 2 }));
  const colors = ['#66ffe0', '#66ffe0', '#66ffe0', '#66c7ff', '#8b7cff', '#ffc857', '#ff8c73'];
  drawStatic(canvas, (context, width, height) => {
    context.strokeStyle = 'rgba(102,255,224,.16)';
    points.forEach((point, index) => {
      const next = points[(index + 5) % points.length];
      context.beginPath();
      context.moveTo(point.x * width, point.y * height);
      context.lineTo(next.x * width, next.y * height);
      context.stroke();
      context.fillStyle = colors[index % colors.length];
      context.globalAlpha = 0.8;
      context.beginPath();
      context.arc(point.x * width, point.y * height, point.size, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
    });
  });
}

/* The settled end state of the workflow scene: an ordered grid with decision points. */
function staticFlow(canvas) {
  drawStatic(canvas, (context, width, height) => {
    const columns = 8;
    const rows = 6;
    const stepX = Math.min(width / (columns + 1), 64);
    const stepY = Math.min(height / (rows + 1), 52);
    const left = (width - stepX * (columns - 1)) / 2;
    const top = (height - stepY * (rows - 1)) / 2;
    context.strokeStyle = 'rgba(10,110,110,.32)';
    for (let row = 0; row < rows; row += 1) {
      context.beginPath();
      context.moveTo(left, top + row * stepY);
      context.lineTo(left + stepX * (columns - 1), top + row * stepY);
      context.stroke();
    }
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const x = left + column * stepX;
        const y = top + row * stepY;
        if (index % 11 === 0 || index === 26) {
          context.fillStyle = '#e0a021';
          context.fillRect(x - 6, y - 6, 12, 12);
        } else {
          context.fillStyle = '#0fae96';
          context.beginPath();
          context.arc(x, y, index % 7 === 0 ? 6 : 4, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
  });
}

async function init() {
  const heroCanvas = document.getElementById('heroCanvas');
  const flowCanvas = document.getElementById('flowCanvas');
  const story = createStory();
  if (!heroCanvas && !flowCanvas) return;

  const fallback = () => {
    if (heroCanvas) staticHero(heroCanvas);
    if (flowCanvas) staticFlow(flowCanvas);
    /* Without the scene, the steps still follow the scroll when motion is allowed. */
    if (story && !reducedMotion) {
      story.goLive();
      createLoop(story.band, () => story.apply(story.progress()));
    }
  };

  if (reducedMotion) { fallback(); return; }
  try {
    const THREE = await import(THREE_URL);
    if (heroCanvas) initHeroScene(THREE, heroCanvas);
    if (flowCanvas && story) initFlowScene(THREE, flowCanvas, story);
  } catch (error) {
    console.warn('3D scene unavailable; showing the static illustration instead.', error);
    fallback();
  }
}

init();

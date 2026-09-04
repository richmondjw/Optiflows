const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initInterface() {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      mobileNav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const intentInput = document.getElementById('leadIntent');
  const message = document.getElementById('leadMessage');
  const placeholders = {
    coordination_drag_audit: 'A handoff, approval, recurring decision or workflow that keeps pulling someone back into the loop.',
    system_install: 'What should the first production system handle, and what must always remain a human decision?',
    operating_partner: 'What is already running, and where does the operating model need to evolve?'
  };
  document.querySelectorAll('[data-intent]').forEach((link) => {
    link.addEventListener('click', () => {
      const intent = link.dataset.intent || 'coordination_drag_audit';
      if (intentInput) intentInput.value = intent;
      if (message) message.placeholder = placeholders[intent] || placeholders.coordination_drag_audit;
    });
  });

  initLeadForm();
}

function initLeadForm() {
  const form = document.getElementById('leadForm');
  const submit = document.getElementById('leadSubmit');
  const status = document.getElementById('formStatus');
  const success = document.getElementById('formSuccess');
  if (!form || !submit || !status || !success) return;

  const endpoint = 'https://formspree.io/f/meelyrkd';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    submit.disabled = true;
    const submitLabel = submit.querySelector('span');
    if (submitLabel) submitLabel.textContent = 'Sending';

    const data = new FormData(form);
    const query = new URLSearchParams(window.location.search);
    const payload = {
      _subject: 'Optiflows coordination drag enquiry',
      name: String(data.get('full_name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company_name') || '').trim(),
      message: String(data.get('message') || '').trim(),
      inquiry_type: String(data.get('inquiry_type') || 'coordination_drag_audit'),
      source_page: window.location.pathname,
      _gotcha: String(data.get('honeypot') || ''),
      utm_source: query.get('utm_source') || '',
      utm_medium: query.get('utm_medium') || '',
      utm_campaign: query.get('utm_campaign') || ''
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Submission failed');
      form.hidden = true;
      success.hidden = false;
    } catch (error) {
      status.textContent = 'Something went wrong. Email hello@optiflows.com directly.';
      submit.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Request the first conversation';
    }
  });
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => (value = value * 16807 % 2147483647) / 2147483647;
}

function resizeRenderer(renderer, camera, canvas) {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
  const targetWidth = Math.floor(width * pixelRatio);
  const targetHeight = Math.floor(height * pixelRatio);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(pixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

async function initSpatialSystem() {
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js');
    initHeroScene(THREE);
    initFlowScene(THREE);
  } catch (error) {
    console.warn('Spatial rendering unavailable. Using the static workflow fallback.', error);
    initCanvasFallback(document.getElementById('heroCanvas'), true);
    initCanvasFallback(document.getElementById('flowCanvas'), false);
  }
}

function initHeroScene(THREE) {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 17);

  const group = new THREE.Group();
  group.position.set(4.6, 0.1, 0);
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
  const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x66ffe0, transparent: true, opacity: 0.15 }));
  group.add(lines);

  const dragValue = document.getElementById('heroDragValue');
  const dragTrack = document.getElementById('heroDragTrack');
  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  const render = (time = 0) => {
    resizeRenderer(renderer, camera, canvas);
    const heroProgress = clamp(window.scrollY / Math.max(1, window.innerHeight));
    const value = Math.round(37 - heroProgress * 13);
    if (dragValue) dragValue.textContent = String(value);
    if (dragTrack) dragTrack.style.width = `${value}%`;
    if (!prefersReducedMotion) {
      group.rotation.y += ((-0.28 + pointerX * 0.13 + time * 0.000025) - group.rotation.y) * 0.025;
      group.rotation.x += ((-0.12 + pointerY * 0.08) - group.rotation.x) * 0.025;
      group.position.y = 0.1 + Math.sin(time * 0.00035) * 0.12;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

function buildStagePositions(THREE, count) {
  const random = seededRandom(1776);
  const stages = Array.from({ length: 5 }, () => []);

  for (let i = 0; i < count; i += 1) {
    const cluster = i % 4;
    const angle = random() * Math.PI * 2;
    const radius = 0.4 + random() * 2.8;
    stages[0].push(new THREE.Vector3(
      (cluster - 1.5) * 2.5 + Math.cos(angle) * radius,
      (random() - 0.5) * 8 + Math.sin(angle) * radius,
      (random() - 0.5) * 5
    ));

    const band = i % 3;
    const rank = Math.floor(i / 3);
    stages[1].push(new THREE.Vector3(
      (band - 1) * 3.4 + (random() - 0.5) * 0.65,
      -5 + rank * 0.62 + (random() - 0.5) * 0.38,
      (random() - 0.5) * 1.2
    ));

    const lane = i % 4;
    const laneRank = Math.floor(i / 4);
    stages[2].push(new THREE.Vector3(
      (lane - 1.5) * 2.05,
      -5 + laneRank * 0.82,
      Math.sin(laneRank * 0.75 + lane) * 0.45
    ));

    const column = i % 6;
    const row = Math.floor(i / 6);
    stages[3].push(new THREE.Vector3(
      (column - 2.5) * 1.55,
      -4.8 + row * 1.36,
      (column === 2 || column === 3) ? 0.45 : -0.1
    ));

    const finalColumn = i % 8;
    const finalRow = Math.floor(i / 8);
    stages[4].push(new THREE.Vector3(
      (finalColumn - 3.5) * 1.15,
      -3.7 + finalRow * 1.48,
      Math.sin(finalColumn * 0.8) * 0.18
    ));
  }
  return stages;
}

function initFlowScene(THREE) {
  const canvas = document.getElementById('flowCanvas');
  const story = document.getElementById('method');
  if (!canvas || !story) return;
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
    const material = new THREE.MeshBasicMaterial({
      color: isGate ? 0x053d3d : isRisk ? 0xff8c73 : 0x0a6e6e,
      transparent: true,
      opacity: isGate ? 1 : 0.82
    });
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
  group.add(lines);

  const travelerGeometry = new THREE.SphereGeometry(0.075, 12, 12);
  const travelerMaterial = new THREE.MeshBasicMaterial({ color: 0x66ffe0 });
  const travelers = Array.from({ length: 9 }, (_, index) => {
    const mesh = new THREE.Mesh(travelerGeometry, travelerMaterial.clone());
    mesh.userData = { edge: (index * 7) % edgePairs.length, offset: index / 9 };
    group.add(mesh);
    return mesh;
  });

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff8c73, transparent: true, opacity: 0.32, side: THREE.DoubleSide });
  const rings = nodes.filter((node) => node.userData.isRisk).map((node) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.33, 32), ringMaterial.clone());
    ring.position.copy(node.position);
    group.add(ring);
    return { ring, node };
  });

  const meterFill = document.getElementById('storyMeterFill');
  const meterValue = document.getElementById('storyMeterValue');
  const progressBar = document.getElementById('storyProgress');
  const steps = [...document.querySelectorAll('.story-step')];

  function getProgress() {
    const rect = story.getBoundingClientRect();
    const distance = Math.max(1, story.offsetHeight - window.innerHeight);
    return clamp(-rect.top / distance);
  }

  function updateScene(time) {
    resizeRenderer(renderer, camera, canvas);
    let progress = prefersReducedMotion ? 1 : getProgress();
    const stagePosition = progress * 4;
    const stage = Math.min(3, Math.floor(stagePosition));
    const stageMix = smooth(stagePosition - stage);
    const activeStage = Math.min(4, Math.round(stagePosition));

    for (let i = 0; i < count; i += 1) {
      const from = stages[stage][i];
      const to = stages[stage + 1][i];
      current[i].set(lerp(from.x, to.x, stageMix), lerp(from.y, to.y, stageMix), lerp(from.z, to.z, stageMix));
      nodes[i].position.copy(current[i]);
      const isRisk = nodes[i].userData.isRisk;
      nodes[i].material.color.setHex(isRisk && progress < 0.58 ? 0xff8c73 : nodes[i].userData.isGate ? 0x053d3d : 0x0a6e6e);
      nodes[i].material.opacity = isRisk && progress > 0.68 ? 0.55 : 0.88;
    }

    edgePairs.forEach(([a, b], index) => {
      const offset = index * 6;
      lineArray[offset] = current[a].x;
      lineArray[offset + 1] = current[a].y;
      lineArray[offset + 2] = current[a].z;
      lineArray[offset + 3] = current[b].x;
      lineArray[offset + 4] = current[b].y;
      lineArray[offset + 5] = current[b].z;
    });
    lineGeometry.attributes.position.needsUpdate = true;
    lines.material.opacity = lerp(0.14, 0.42, progress);

    rings.forEach(({ ring, node }, index) => {
      ring.position.copy(node.position);
      ring.lookAt(camera.position);
      const pulse = 1 + Math.sin(time * 0.003 + index) * 0.14;
      ring.scale.setScalar(pulse);
      ring.material.opacity = (1 - clamp((progress - 0.56) / 0.18)) * 0.35;
    });

    travelers.forEach((traveler, index) => {
      const [a, b] = edgePairs[traveler.userData.edge];
      const speed = lerp(0.00016, 0.00038, progress);
      const t = (time * speed + traveler.userData.offset) % 1;
      traveler.position.lerpVectors(current[a], current[b], t);
      traveler.material.opacity = progress > 0.35 ? 1 : 0.46;
      traveler.scale.setScalar(0.75 + progress * 0.55);
    });

    if (!prefersReducedMotion) {
      group.rotation.y = 0.12 + Math.sin(time * 0.00022) * 0.08;
      group.rotation.x = -0.08 + Math.cos(time * 0.00019) * 0.035;
    }

    const drag = Math.round(lerp(42, 8, smooth(progress)));
    if (meterFill) meterFill.style.width = `${drag}%`;
    if (meterValue) meterValue.textContent = `${drag}%`;
    if (progressBar) progressBar.style.height = `${progress * 100}%`;
    steps.forEach((step, index) => step.classList.toggle('is-active', index === activeStage));

    renderer.render(scene, camera);
    requestAnimationFrame(updateScene);
  }
  requestAnimationFrame(updateScene);
}

function initCanvasFallback(canvas, isHero) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const random = seededRandom(isHero ? 776 : 1776);
  const count = isHero ? 48 : 36;
  const points = Array.from({ length: count }, () => ({ x: random(), y: random(), size: 1 + random() * 2 }));

  const render = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = isHero ? 'rgba(102,255,224,.16)' : 'rgba(10,110,110,.22)';
    context.fillStyle = isHero ? 'rgba(102,255,224,.8)' : 'rgba(10,110,110,.82)';
    points.forEach((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      const next = points[(index + 5) % points.length];
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(next.x * width, next.y * height);
      context.stroke();
      context.beginPath();
      context.arc(x, y, point.size, 0, Math.PI * 2);
      context.fill();
    });
  };
  render();
  window.addEventListener('resize', render, { passive: true });
}

initInterface();
initSpatialSystem();

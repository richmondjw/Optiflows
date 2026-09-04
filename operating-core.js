import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';

const canvas = document.getElementById('operatingCoreCanvas');
const experience = document.querySelector('[data-core-experience]');
const stage = canvas ? canvas.closest('.CoreStage') : null;

if (canvas && experience && stage) {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    document.documentElement.classList.add('has-operating-core');

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    const root = new THREE.Group();
    root.rotation.set(-0.12, -0.2, 0.02);
    scene.add(root);

    const colours = {
      dark: 0x053d3d,
      mid: 0x0a6e6e,
      electric: 0x66ffe0,
      mist: 0xb8e8e0,
      pale: 0xe0fff6,
      white: 0xffffff,
      warning: 0xe9a66f
    };

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: colours.dark,
      roughness: 0.38,
      metalness: 0.16
    });

    const midMaterial = new THREE.MeshStandardMaterial({
      color: colours.mid,
      roughness: 0.35,
      metalness: 0.08
    });

    const electricMaterial = new THREE.MeshStandardMaterial({
      color: colours.electric,
      emissive: colours.electric,
      emissiveIntensity: 0.66,
      roughness: 0.24,
      metalness: 0.08
    });

    const warningMaterial = new THREE.MeshStandardMaterial({
      color: colours.warning,
      emissive: colours.warning,
      emissiveIntensity: 0.72,
      roughness: 0.3,
      metalness: 0.04
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: colours.pale,
      transparent: true,
      opacity: 0.46,
      roughness: 0.18,
      metalness: 0,
      transmission: 0.24,
      thickness: 0.4,
      depthWrite: false
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: colours.mid,
      transparent: true,
      opacity: 0.42
    });

    scene.add(new THREE.HemisphereLight(colours.white, colours.dark, 2.2));

    const keyLight = new THREE.DirectionalLight(colours.white, 3.6);
    keyLight.position.set(4.8, 6.4, 8);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(colours.electric, 12, 18, 2);
    rimLight.position.set(-4.4, -2.2, 4.4);
    scene.add(rimLight);

    const hub = new THREE.Group();
    const hubShell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 2), darkMaterial);
    const hubGlow = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.46, 2),
      electricMaterial
    );
    const hubHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.98, 32, 32),
      new THREE.MeshBasicMaterial({
        color: colours.electric,
        transparent: true,
        opacity: 0.075,
        depthWrite: false
      })
    );
    const hubBeacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), electricMaterial);
    hubBeacon.position.z = 0.73;
    hub.add(hubHalo, hubShell, hubGlow, hubBeacon);
    root.add(hub);

    const componentStates = [];
    const ringStates = [];
    const nodes = [];
    const connectors = [];
    const checkpoints = [];

    function remember(object, target, exploded, targetRotation, explodedRotation) {
      object.position.copy(exploded);
      object.rotation.set(explodedRotation.x, explodedRotation.y, explodedRotation.z);
      componentStates.push({
        object,
        target: target.clone(),
        exploded: exploded.clone(),
        targetRotation: { ...targetRotation },
        explodedRotation: { ...explodedRotation }
      });
    }

    const ringSpecs = [
      { radius: 1.18, tube: 0.045, material: electricMaterial, rotation: { x: 1.56, y: 0.18, z: 0.08 } },
      { radius: 1.62, tube: 0.055, material: midMaterial, rotation: { x: 0.34, y: 1.17, z: 0.18 } },
      { radius: 2.06, tube: 0.035, material: darkMaterial, rotation: { x: 1.08, y: 0.12, z: 0.82 } }
    ];

    ringSpecs.forEach((spec, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(spec.radius, spec.tube, 12, 104),
        spec.material
      );
      const exploded = new THREE.Vector3(
        index === 0 ? -2.6 : index === 1 ? 2.9 : 0.3,
        index === 0 ? 1.8 : index === 1 ? -1.7 : 2.7,
        index === 2 ? -1.8 : 0.7 + index * 0.45
      );
      const explodedRotation = {
        x: spec.rotation.x + (index + 1) * 0.88,
        y: spec.rotation.y - (index + 1) * 0.72,
        z: spec.rotation.z + (index + 1) * 0.5
      };
      remember(ring, new THREE.Vector3(), exploded, spec.rotation, explodedRotation);
      ringStates.push(ring);
      root.add(ring);
    });

    const nodeTargets = [
      [-2.35, 0.15, 0.2],
      [-1.64, 1.72, -0.12],
      [0.08, 2.22, 0.16],
      [1.78, 1.55, -0.18],
      [2.42, -0.08, 0.12],
      [1.55, -1.72, -0.06],
      [-0.12, -2.16, 0.2],
      [-1.75, -1.5, -0.16]
    ];

    nodeTargets.forEach((coords, index) => {
      const target = new THREE.Vector3(...coords);
      const direction = target.clone().normalize();
      const exploded = target.clone().multiplyScalar(1.72);
      exploded.z += index % 2 === 0 ? 1.45 : -1.2;
      exploded.x += Math.sin(index * 2.4) * 0.72;
      exploded.y += Math.cos(index * 1.7) * 0.5;

      const node = new THREE.Group();
      const nodeBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.27, 0.17, 6),
        index % 3 === 0 ? electricMaterial : darkMaterial
      );
      nodeBody.rotation.x = Math.PI / 2;
      const nodeOrbit = new THREE.Mesh(
        new THREE.TorusGeometry(0.37, 0.018, 8, 40),
        index % 3 === 0 ? midMaterial : electricMaterial
      );
      node.add(nodeOrbit, nodeBody);
      remember(
        node,
        target,
        exploded,
        { x: 0, y: 0, z: Math.atan2(direction.y, direction.x) },
        { x: index * 0.18, y: index * 0.38, z: -index * 0.27 }
      );
      nodes.push(node);
      root.add(node);

      const first = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 1, 8),
        index % 3 === 0 ? electricMaterial : midMaterial
      );
      const second = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 1, 8),
        glassMaterial.clone()
      );
      root.add(first, second);
      connectors.push({ first, second, node, target, index });
    });

    const panelTargets = [
      new THREE.Vector3(-2.62, 1.82, -0.5),
      new THREE.Vector3(2.55, 1.84, -0.55),
      new THREE.Vector3(2.66, -1.7, -0.45),
      new THREE.Vector3(-2.57, -1.78, -0.5)
    ];

    panelTargets.forEach((target, index) => {
      const panel = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.5, 0.09), glassMaterial.clone());
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(body.geometry),
        new THREE.LineBasicMaterial({ color: colours.mid, transparent: true, opacity: 0.56 })
      );
      const signal = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.035, 0.025), electricMaterial);
      signal.position.set(-0.2, -0.12, 0.065);
      panel.add(body, edges, signal);

      const exploded = target.clone().multiplyScalar(1.48);
      exploded.z += 1.4 + index * 0.18;
      remember(
        panel,
        target,
        exploded,
        { x: 0.06, y: index % 2 ? -0.16 : 0.16, z: index % 2 ? -0.08 : 0.08 },
        { x: 0.6 - index * 0.2, y: -0.5 + index * 0.3, z: 0.9 - index * 0.45 }
      );
      root.add(panel);
    });

    const cage = new THREE.Group();
    [
      [5.72, 4.7, 2.5],
      [4.96, 4.02, 2.16]
    ].forEach((size, index) => {
      const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(...size));
      const material = new THREE.LineBasicMaterial({
        color: index === 0 ? colours.mid : colours.electric,
        transparent: true,
        opacity: 0
      });
      const frame = new THREE.LineSegments(geometry, material);
      frame.rotation.set(0.08, index === 0 ? -0.16 : 0.14, index === 0 ? 0.04 : -0.03);
      cage.add(frame);
    });
    root.add(cage);

    const checkpointPositions = [
      [-2.82, 2.3, 1.24],
      [2.82, 2.3, 1.24],
      [2.82, -2.3, 1.24],
      [-2.82, -2.3, 1.24]
    ];
    checkpointPositions.forEach((position) => {
      const checkpoint = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.13, 0),
        electricMaterial
      );
      checkpoint.position.set(...position);
      checkpoint.scale.setScalar(0.001);
      checkpoints.push(checkpoint);
      root.add(checkpoint);
    });

    const signalParticles = [];
    for (let index = 0; index < 16; index += 1) {
      const particleMaterial = (index % 4 === 0 ? warningMaterial : electricMaterial).clone();
      particleMaterial.transparent = true;
      particleMaterial.opacity = 0.72;
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(index % 4 === 0 ? 0.082 : 0.05, 12, 12),
        particleMaterial
      );
      root.add(particle);
      signalParticles.push({
        mesh: particle,
        route: index % nodeTargets.length,
        phase: (index * 0.173) % 1,
        drift: new THREE.Vector3(
          Math.sin(index * 4.1) * 0.72,
          Math.cos(index * 2.7) * 0.82,
          Math.sin(index * 1.9) * 0.58
        )
      });
    }

    const dustPositions = new Float32Array(84 * 3);
    for (let index = 0; index < 84; index += 1) {
      const radius = 3.1 + ((index * 17) % 31) / 13;
      const angle = index * 2.39996;
      dustPositions[index * 3] = Math.cos(angle) * radius;
      dustPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.72;
      dustPositions[index * 3 + 2] = -1.8 + ((index * 7) % 25) / 9;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: colours.mid,
        size: 0.025,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      })
    );
    root.add(dust);

    const stateElements = Array.from(document.querySelectorAll('[data-core-step]'));
    const statusElement = document.getElementById('coreStageStatus');
    const counterElement = document.getElementById('coreStageCounter');
    const stateLabels = [
      'Fragmented network',
      'Coordination leakage detected',
      'Operating layer constructing',
      'Governed system online'
    ];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactLayout = window.matchMedia('(max-width: 900px)');
    const up = new THREE.Vector3(0, 1, 0);
    const tempStart = new THREE.Vector3();
    const tempEnd = new THREE.Vector3();
    const tempDirection = new THREE.Vector3();
    const tempMid = new THREE.Vector3();

    let targetProgress = 0;
    let currentProgress = 0;
    let visible = true;
    let lastState = -1;
    let lastTime = performance.now();

    function clamp(value, min = 0, max = 1) {
      return Math.min(max, Math.max(min, value));
    }

    function smoothstep(edge0, edge1, value) {
      const progress = clamp((value - edge0) / (edge1 - edge0));
      return progress * progress * (3 - 2 * progress);
    }

    function triangle(center, width, value) {
      return clamp(1 - Math.abs(value - center) / width);
    }

    function positionSegment(mesh, start, end, opacity) {
      tempDirection.subVectors(end, start);
      const length = Math.max(0.001, tempDirection.length());
      tempMid.copy(start).add(end).multiplyScalar(0.5);
      mesh.position.copy(tempMid);
      mesh.quaternion.setFromUnitVectors(up, tempDirection.normalize());
      mesh.scale.set(1, length, 1);
      mesh.material.transparent = true;
      mesh.material.opacity = opacity;
    }

    function stateIndexFor(progress) {
      if (progress < 0.2) return 0;
      if (progress < 0.49) return 1;
      if (progress < 0.79) return 2;
      return 3;
    }

    function updateStateLabel(progress) {
      const index = stateIndexFor(progress);
      if (index === lastState) return;
      lastState = index;
      stateElements.forEach((element, elementIndex) => {
        element.classList.toggle('is-active', elementIndex === index);
      });
      if (statusElement) statusElement.textContent = stateLabels[index];
      if (counterElement) counterElement.textContent = String(index + 1).padStart(2, '0');
    }

    function updateScrollProgress() {
      if (reducedMotion.matches || compactLayout.matches) {
        targetProgress = 1;
        return;
      }
      const rect = experience.getBoundingClientRect();
      const distance = Math.max(1, experience.offsetHeight - window.innerHeight);
      targetProgress = clamp(-rect.top / distance);
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const maxRatio = compactLayout.matches ? 1 : 1.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      updateScrollProgress();
    }

    function applyScene(progress, time) {
      const assembly = smoothstep(0.43, 0.76, progress);
      const guard = smoothstep(0.78, 0.98, progress);
      const leakage = triangle(0.31, 0.25, progress) * (1 - guard);
      const fragmented = 1 - assembly;
      const idle = reducedMotion.matches ? 0 : Math.sin(time * 0.00072) * 0.035;

      componentStates.forEach((state, index) => {
        state.object.position.lerpVectors(state.exploded, state.target, assembly);
        state.object.rotation.set(
          THREE.MathUtils.lerp(state.explodedRotation.x, state.targetRotation.x, assembly),
          THREE.MathUtils.lerp(state.explodedRotation.y, state.targetRotation.y, assembly),
          THREE.MathUtils.lerp(state.explodedRotation.z, state.targetRotation.z, assembly)
        );
        if (assembly < 0.98) {
          state.object.rotation.z += Math.sin(time * 0.00045 + index * 1.8) * 0.04 * fragmented;
        }
      });

      hub.scale.setScalar(0.72 + assembly * 0.28 + guard * 0.05);
      hub.rotation.y = time * 0.00018 + progress * 0.9;
      hub.rotation.x = -time * 0.00011 + progress * 0.28;
      hubBeacon.rotation.z = -time * 0.0012;
      hubBeacon.scale.setScalar(0.86 + leakage * 0.55 + guard * 0.24);
      hubGlow.scale.setScalar(0.88 + leakage * 0.28 + guard * 0.14 + idle);
      hubHalo.material.opacity = 0.045 + leakage * 0.13 + guard * 0.08;

      ringStates.forEach((ring, index) => {
        ring.rotation.z += idle * (index % 2 ? -0.55 : 0.55);
      });

      connectors.forEach((connector) => {
        const nodePosition = connector.node.position;
        const join = 0.34 + assembly * 0.66;
        const returnJoin = 0.28 + assembly * 0.72;
        tempStart.set(0, 0, 0);
        tempEnd.copy(nodePosition).multiplyScalar(join);
        positionSegment(connector.first, tempStart, tempEnd, 0.17 + assembly * 0.74);

        tempStart.copy(nodePosition);
        tempEnd.copy(nodePosition).multiplyScalar(1 - returnJoin);
        positionSegment(connector.second, tempStart, tempEnd, 0.18 + assembly * 0.42);
      });

      cage.children.forEach((frame, index) => {
        frame.material.opacity = guard * (index === 0 ? 0.44 : 0.27);
        const cageScale = 1.22 - guard * 0.22 + idle * 0.04;
        frame.scale.setScalar(cageScale);
      });

      checkpoints.forEach((checkpoint, index) => {
        const scale = Math.max(0.001, guard * (0.88 + Math.sin(time * 0.002 + index) * 0.12));
        checkpoint.scale.setScalar(scale);
        checkpoint.rotation.y = time * 0.001 + index;
      });

      signalParticles.forEach((signal, index) => {
        const nodePosition = nodes[signal.route].position;
        const routeProgress = (time * 0.00018 + signal.phase + progress * 0.72) % 1;
        signal.mesh.position.copy(nodePosition).multiplyScalar(routeProgress);
        if (leakage > 0.02) {
          const gapFocus = 1 - Math.abs(routeProgress - 0.5) * 2;
          signal.mesh.position.addScaledVector(signal.drift, leakage * gapFocus * 1.25);
        }
        signal.mesh.material.opacity = 0.26 + assembly * 0.62 + leakage * 0.12;
        const pulse = 0.78 + Math.sin(time * 0.004 + index * 1.8) * 0.22;
        signal.mesh.scale.setScalar(pulse * (0.74 + leakage * 0.34));
      });

      root.rotation.x = -0.12 + progress * 0.16 + idle * 0.35;
      root.rotation.y = -0.38 + progress * 0.74 + idle;
      root.rotation.z = 0.035 - progress * 0.07;
      root.position.y = Math.sin(time * 0.00062) * 0.055 * (1 - guard * 0.6);
      root.scale.setScalar(0.89 + assembly * 0.06);
      dust.rotation.z = -time * 0.000035;
      dust.material.opacity = 0.12 + fragmented * 0.22;

      camera.position.z = 9.25 - assembly * 0.35;
      camera.lookAt(0, 0, 0);
      updateStateLabel(progress);
    }

    function render(time) {
      const delta = Math.min(48, time - lastTime);
      lastTime = time;
      const smoothing = reducedMotion.matches || compactLayout.matches ? 1 : 1 - Math.pow(0.0008, delta / 1000);
      currentProgress += (targetProgress - currentProgress) * smoothing;

      applyScene(currentProgress, time);
      renderer.render(scene, camera);

      if (visible && !reducedMotion.matches && !compactLayout.matches) {
        requestAnimationFrame(render);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) {
        lastTime = performance.now();
        requestAnimationFrame(render);
      }
    }, { threshold: 0 });

    observer.observe(experience);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', () => {
      resize();
      applyScene(targetProgress, performance.now());
      renderer.render(scene, camera);
    }, { passive: true });
    reducedMotion.addEventListener('change', () => {
      updateScrollProgress();
      currentProgress = targetProgress;
      applyScene(currentProgress, performance.now());
      renderer.render(scene, camera);
    });
    compactLayout.addEventListener('change', () => {
      resize();
      currentProgress = targetProgress;
      applyScene(currentProgress, performance.now());
      renderer.render(scene, camera);
    });

    resize();
    currentProgress = targetProgress;
    applyScene(currentProgress, performance.now());
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  } catch (error) {
    console.warn('Operating core fallback enabled.', error);
  }
}

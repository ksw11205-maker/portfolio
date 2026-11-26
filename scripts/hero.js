import * as THREE from '../vendor/three/three.module.min.js';
import { brandShape } from './brand-shape.js';

export function createHero(container, startPaused = false) {
  const canvas = container.querySelector('canvas');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  camera.position.set(0, .15, 11.5);
  camera.lookAt(0, 0, 0);

  // A small procedural studio environment: broad white softboxes and a cool rim.
  const w = 384, h = 192, data = new Float32Array(w * h * 4);
  const glow = (u, v, x, y, sx, sy) => {
    const dx = Math.min(Math.abs(u - x), 1 - Math.abs(u - x));
    return Math.exp(-.5 * ((dx / sx) ** 2 + ((v - y) / sy) ** 2));
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w, v = y / h, i = (y * w + x) * 4;
    const key = glow(u, v, .23, .29, .12, .12) * 5.2;
    const strip = glow(u, v, .73, .43, .025, .28) * 7;
    const top = glow(u, v, .5, .1, .3, .055) * 2.8;
    const blue = glow(u, v, .93, .6, .13, .18) * 1.9;
    data[i] = .10 + key + strip + top + blue * .15;
    data[i + 1] = .12 + key * .97 + strip + top + blue * .35;
    data[i + 2] = .16 + key * .94 + strip + top + blue;
    data[i + 3] = 1;
  }
  const createEnvironment = () => {
    const texture = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.FloatType);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.needsUpdate = true;
    const generator = new THREE.PMREMGenerator(renderer);
    const target = generator.fromEquirectangular(texture);
    texture.dispose(); generator.dispose();
    return target;
  };
  let envTarget = createEnvironment();
  scene.environment = envTarget.texture;

  const shape = new THREE.Shape();
  const sx = x => (x - brandShape.width / 2) * .007;
  const sy = y => (brandShape.height / 2 - y) * .007;
  brandShape.commands.forEach(([command, ...p]) => {
    if (command === 'M') shape.moveTo(sx(p[0]), sy(p[1]));
    if (command === 'L') shape.lineTo(sx(p[0]), sy(p[1]));
    if (command === 'C') shape.bezierCurveTo(sx(p[0]), sy(p[1]), sx(p[2]), sy(p[3]), sx(p[4]), sy(p[5]));
    if (command === 'Z') shape.closePath();
  });
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .58, bevelEnabled: true, bevelSegments: 10, steps: 1, bevelSize: .065, bevelThickness: .065, curveSegments: 24 });
  geometry.translate(0, 0, -.29);
  geometry.computeVertexNormals();
  const blue = new THREE.MeshPhysicalMaterial({ color: brandShape.blue, metalness: .87, roughness: .22, clearcoat: 1, clearcoatRoughness: .17, envMapIntensity: 1.2 });
  const silver = new THREE.MeshPhysicalMaterial({ color: '#dbe0e8', metalness: 1, roughness: .23, clearcoat: .3, clearcoatRoughness: .17, envMapIntensity: 1.25 });
  const a = new THREE.Mesh(geometry, blue), b = new THREE.Mesh(geometry, silver);
  b.rotation.z = Math.PI;
  const group = new THREE.Group(); group.add(a, b); scene.add(group);
  group.rotation.set(.16, -.42, -.17);
  const keyLight = new THREE.DirectionalLight('#f8f7f0', 3.1); keyLight.position.set(-3, 5, 7); scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight('#a4bfff', 2.8); rimLight.position.set(4, 2, -2); scene.add(rimLight);
  const fillLight = new THREE.DirectionalLight('#e0e7ee', .8); fillLight.position.set(-4, -2, 3); scene.add(fillLight);

  let visible = true, paused = startPaused, frame = 0, elapsed = 0, last = 0, disposed = false, contextLost = false;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const resize = () => {
    if (disposed || contextLost) return;
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 12.5 : 10.8;
    camera.updateProjectionMatrix();
    renderOnce();
  };
  const pose = () => {
    const t = paused ? 1 : Math.min(elapsed / 1.75, 1);
    const ease = 1 - (1 - t) ** 4;
    a.position.set(-(1 - ease) * 2.4, (1 - ease) * .9, .04);
    b.position.set((1 - ease) * 2.4, -(1 - ease) * .9, -.04);
    const breathe = paused ? 0 : Math.sin(elapsed * .4) * .075;
    pointerX += (targetX - pointerX) * .035; pointerY += (targetY - pointerY) * .035;
    group.rotation.set(.16 + pointerY * .08, -.42 + breathe + pointerX * .14, -.17 + (paused ? 0 : Math.sin(elapsed * .28) * .025));
    group.position.y = paused ? 0 : Math.sin(elapsed * .55) * .06;
  };
  function renderOnce() {
    if (disposed || contextLost) return;
    pose(); renderer.render(scene, camera); container.classList.add('is-ready');
  }
  const shouldRun = () => visible && !paused && !document.hidden && !disposed && !contextLost;
  const tick = time => {
    frame = 0;
    if (!shouldRun()) { last = 0; return; }
    if (last) elapsed += Math.min((time - last) / 1000, .05);
    last = time; renderOnce(); frame = requestAnimationFrame(tick);
  };
  const requestFrame = () => { if (!frame && shouldRun()) frame = requestAnimationFrame(tick); };
  const visibilityObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; requestFrame(); }, { rootMargin: '100px' });
  visibilityObserver.observe(container);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  const onMotion = event => {
    paused = event.detail.paused;
    if (paused) { cancelAnimationFrame(frame); frame = 0; last = 0; targetX = targetY = pointerX = pointerY = 0; renderOnce(); }
    else { elapsed = Math.max(elapsed, 1.75); requestFrame(); }
  };
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; last = 0; } else requestFrame(); };
  const pointerFine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const onPointer = event => {
    if (!visible || paused || !pointerFine) return;
    targetX = (event.clientX / innerWidth - .5) * 2;
    targetY = (event.clientY / innerHeight - .5) * 2;
  };
  const onContextLost = event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; last = 0; container.classList.remove('is-ready'); };
  const onContextRestored = () => {
    try {
      const restoredEnvironment = createEnvironment();
      envTarget.dispose(); envTarget = restoredEnvironment; scene.environment = envTarget.texture;
      contextLost = false; resize(); requestFrame();
    } catch { contextLost = true; container.classList.remove('is-ready'); }
  };
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  document.addEventListener('portfolio:motion-change', onMotion);
  document.addEventListener('visibilitychange', onVisibility);
  addEventListener('pointermove', onPointer, { passive: true });
  addEventListener('pagehide', event => {
    if (event.persisted) return;
    disposed = true; cancelAnimationFrame(frame); visibilityObserver.disconnect(); resizeObserver.disconnect();
    document.removeEventListener('portfolio:motion-change', onMotion);
    document.removeEventListener('visibilitychange', onVisibility); removeEventListener('pointermove', onPointer);
    geometry.dispose(); blue.dispose(); silver.dispose(); envTarget.dispose(); renderer.dispose();
  });
  resize(); requestFrame();
}

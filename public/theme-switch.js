import { LiquidGlassEngine } from './vendor/liquid-glass.js';

export function initThemeSwitch() {
  const control = document.querySelector('.theme-switch');
  const scene = control.querySelector('.switch-scene');
  const thumb = control.querySelector('.switch-thumb');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let dark = document.documentElement.dataset.theme === 'dark';
  let position = dark ? 1 : 0, goal = position, lift = 0, liftGoal = 0;
  let speed = 0, liftSpeed = 0, frame = 0, last = 0;
  let pointer = null, suppressClick = false, engine, sizeKey;
  const clamp = n => Math.max(0, Math.min(1, n));
  function paint() {
    const p = clamp(position), amount = clamp(lift);
    const width = 28 + 18 * amount, height = 18 + 12 * amount, center = 26 + 16 * p;
    control.style.setProperty('--switch-progress', p);
    control.style.setProperty('--switch-lift', amount);
    control.style.setProperty('--switch-white', (1 - amount) ** 2);
    thumb.style.width = `${width}px`;
    thumb.style.height = `${height}px`;
    thumb.style.transform = `translate3d(${center - width / 2}px,${22 - height / 2}px,0)`;
    if (!engine) return;
    if (amount < .005 && !pointer) {
      scene.style.filter = 'none';
      return;
    }
    const filter = control.querySelector('filter');
    if (filter) scene.style.filter = `url(#${filter.id})`;
    // The switch map compresses vertically more than horizontally, so the lens
    // shows the nearby track, rather than pulling the entire track into view.
    const displacement = -25 * Math.SQRT2 / Math.hypot(scene.offsetWidth, scene.offsetHeight);
    engine.setOptions({strength: displacement * amount, specular: 0});
    const w = Math.round(width * 2) / 2, h = Math.round(height * 2) / 2;
    const key = `${w}:${h}`;
    if (key !== sizeKey) { engine.setOptions({width: w, height: h}); sizeKey = key; }
    engine.setPosition(center / 68, .5);
  }
  function tick(time) {
    const dt = Math.min((time - (last || time - 16)) / 1000, .032);
    last = time;
    speed += ((goal - position) * 520 - speed * 36) * dt;
    liftSpeed += ((liftGoal - lift) * 520 - liftSpeed * 36) * dt;
    position += speed * dt; lift += liftSpeed * dt;
    const moving = Math.abs(goal-position) + Math.abs(liftGoal-lift) + Math.abs(speed) + Math.abs(liftSpeed) > .005;
    if (!moving) { position = goal; lift = liftGoal; last = 0; }
    paint(); frame = moving ? requestAnimationFrame(tick) : 0;
  }
  function animate() {
    if (reduced.matches) {
      cancelAnimationFrame(frame); frame = last = speed = liftSpeed = 0;
      position = goal; lift = liftGoal; paint();
    } else if (!frame) frame = requestAnimationFrame(tick);
  }
  function setTheme(next, persist = true) {
    dark = next; goal = dark ? 1 : 0;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#151517' : '#ffffff';
    control.setAttribute('aria-checked', String(dark));
    if (persist) { try { localStorage.setItem('my-space-theme', dark ? 'dark' : 'light'); } catch {} }
    animate();
  }
  control.addEventListener('pointerdown', e => {
    if (e.button !== 0 || !e.isPrimary || pointer) return;
    pointer = {id:e.pointerId, start:e.clientX, initial:clamp(position), moved:false};
    suppressClick = false; control.setPointerCapture(e.pointerId);
    control.classList.add('is-held'); liftGoal = 1; animate();
  });
  control.addEventListener('pointermove', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const delta = e.clientX - pointer.start;
    if (Math.abs(delta) > 3) pointer.moved = true;
    if (!pointer.moved) return;
    position = goal = clamp(pointer.initial + delta / 16); speed = 0; paint();
  });
  function release(e, cancelled = false) {
    if (!pointer || pointer.id !== e.pointerId) return;
    const next = cancelled ? dark : pointer.moved ? goal >= .5 : !dark, id = pointer.id;
    pointer = null; suppressClick = true; liftGoal = 0;
    control.classList.remove('is-held');
    if (control.hasPointerCapture(id)) control.releasePointerCapture(id);
    setTheme(next, !cancelled);
    setTimeout(() => { suppressClick = false; }, 0);
  }
  control.addEventListener('pointerup', e => release(e));
  control.addEventListener('pointercancel', e => release(e, true));
  control.addEventListener('lostpointercapture', e => release(e, true));
  control.addEventListener('click', () => { if (!suppressClick) setTheme(!dark); });
  control.addEventListener('keydown', e => {
    if (e.key === 'Escape' && pointer) release({pointerId:pointer.id}, true);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setTheme(e.key === 'ArrowRight'); }
  });
  window.addEventListener('storage', e => { if (e.key === 'my-space-theme') setTheme(e.newValue === 'dark', false); });
  reduced.addEventListener('change', animate);
  try {
    engine = new LiquidGlassEngine({container:control, filtered:scene, defsHost:control.querySelector('.switch-defs')}, {
      width:28, height:18, radius:'auto', strength:0, chromaticAberration:.08, blur:0,
      depth:9, curvature:.6, glow:0, edgeHighlight:0, specular:0, quality:256,
    });
    // R/G encode horizontal/vertical sampling. Keep the neutral midpoint at .5
    // and attenuate horizontal displacement without changing the lens mask.
    const filter = control.querySelector('filter');
    const displacementNodes = [...filter.querySelectorAll('feDisplacementMap')];
    const directionalMap = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    directionalMap.setAttribute('in', 'map');
    directionalMap.setAttribute('type', 'matrix');
    directionalMap.setAttribute('values', '.28 0 0 0 .36  0 .8 0 0 .1  0 0 1 0 0  0 0 0 1 0');
    directionalMap.setAttribute('result', 'switchDirectionalMap');
    filter.insertBefore(directionalMap, displacementNodes[0]);
    displacementNodes.forEach(node => node.setAttribute('in2', 'switchDirectionalMap'));
  } catch { scene.style.filter = ''; control.querySelector('.switch-defs').replaceChildren(); }
  control.setAttribute('aria-checked', String(dark)); paint();
}

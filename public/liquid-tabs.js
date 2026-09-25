import { LiquidGlassEngine } from './vendor/liquid-glass.js';

// Aave-inspired spring selection, powered by Pallav Agarwal's SVG refraction engine.
// Keep actual buttons in the filtered scene: no duplicate labels or inaccessible controls.
export function initLiquidTabs() {
  const bar = document.querySelector('.navigation');
  const surface = bar.querySelector('.tab-surface');
  const tabs = [...bar.querySelectorAll('[role="tab"]')];
  const rim = bar.querySelector('.liquid-indicator');
  const mobile = matchMedia('(max-width: 640px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let drag = null;
  let suppressClick = false;
  let frame = 0;
  let lastTime = 0;
  let engine = null;
  let lastShape = '';
  const state = { x: 0, width: 80, height: 26, lift: 0 };
  const target = { ...state };
  const velocity = { x: 0, width: 0, height: 0, lift: 0 };

  function measure(index) {
    const tab = tabs[index];
    return { x: tab.offsetLeft + tab.offsetWidth / 2, width: tab.offsetWidth + (mobile.matches ? 2 : -4), height: tab.offsetHeight + (mobile.matches ? 4 : -2), lift: 0 };
  }
  function pressedShape(measured, x = measured.x) {
    return { x, width: mobile.matches ? measured.width * 1.28 : (measured.width + 4) * 1.20,
      height: mobile.matches ? 84 : 50, lift: 1 };
  }
  function paint() {
    const top = (surface.offsetHeight - state.height) / 2;
    rim.style.width = `${state.width}px`;
    rim.style.height = `${state.height}px`;
    rim.style.transform = `translate3d(${state.x - state.width / 2}px,${top}px,0)`;
    const lift = Math.max(0, Math.min(1, state.lift));
    bar.style.setProperty('--lift', lift);
    if (!engine) return;
    if (lift < .005 && !drag) {
      surface.style.filter = 'none';
      return;
    }
    const filter = bar.querySelector('filter');
    if (filter) surface.style.filter = `url(#${filter.id})`;
    // Negative displacement samples outward: the track contracts inside the lens.
    // Pixel-based strength keeps that refraction consistent at every viewport.
    const displacement = -10 * Math.SQRT2 / Math.hypot(surface.offsetWidth, surface.offsetHeight);
    engine.setOptions({ strength: displacement * lift, specular: 0 });
    // Quantize half-pixels to avoid regenerating maps for imperceptible changes.
    const width = Math.round(state.width * 2) / 2;
    const height = Math.round(state.height * 2) / 2;
    const shape = `${width}:${height}`;
    if (shape !== lastShape) {
      engine.setOptions({ width, height });
      lastShape = shape;
    }
    engine.setPosition(state.x / surface.offsetWidth, .5);
  }
  function animate(time) {
    const dt = Math.min((time - (lastTime || time - 16)) / 1000, .032);
    lastTime = time;
    let moving = false;
    for (const key of Object.keys(state)) {
      const acceleration = (target[key] - state[key]) * 560 - velocity[key] * 40;
      velocity[key] += acceleration * dt;
      state[key] += velocity[key] * dt;
      if (Math.abs(target[key] - state[key]) > (key === 'lift' ? .003 : .035) || Math.abs(velocity[key]) > .12) moving = true;
    }
    if (!moving) Object.assign(state, target);
    paint();
    frame = moving ? requestAnimationFrame(animate) : 0;
    if (!moving) lastTime = 0;
  }
  function moveTo(next, immediate = false) {
    Object.assign(target, next);
    if (immediate || reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      Object.assign(state, target);
      for (const key of Object.keys(velocity)) velocity[key] = 0;
      paint();
    } else if (!frame) frame = requestAnimationFrame(animate);
  }
  function select(index, { focus = false, history = true, immediate = false } = {}) {
    selected = index;
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      document.getElementById(tab.dataset.panel).hidden = i !== index;
    });
    moveTo(measure(index), immediate);
    if (focus) tabs[index].focus({ preventScroll: true });
    const hash = `#${tabs[index].dataset.panel}`;
    if (history && location.hash !== hash) window.history.pushState(null, '', hash);
  }
  function fromHash(immediate = false) {
    const index = tabs.findIndex((tab) => `#${tab.dataset.panel}` === location.hash);
    select(Math.max(0, index), { history: false, immediate });
  }
  function nearest(x) {
    return tabs.reduce((best, _, i) => Math.abs(measure(i).x - x) < Math.abs(measure(best).x - x) ? i : best, 0);
  }
  function clearPressed() {
    bar.classList.remove('is-pressed', 'is-dragging');
    tabs.forEach((tab) => tab.classList.remove('drag-over'));
  }
  bar.addEventListener('pointerdown', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || drag || event.button !== 0 || !event.isPrimary) return;
    const index = tabs.indexOf(tab);
    const measured = measure(index);
    drag = { id: event.pointerId, index, start: event.clientX, offset: event.clientX - surface.getBoundingClientRect().left - measured.x, moved: false };
    suppressClick = false;
    bar.setPointerCapture(event.pointerId);
    bar.classList.add('is-pressed');
    tab.classList.add('drag-over');
    moveTo(pressedShape(measured));
  });
  bar.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    if (Math.abs(event.clientX - drag.start) > 4) drag.moved = true;
    if (!drag.moved) return;
    bar.classList.add('is-dragging');
    const x = event.clientX - surface.getBoundingClientRect().left - drag.offset;
    const index = nearest(x);
    const measured = measure(index);
    const clamped = Math.max(measure(0).x - 7, Math.min(measure(tabs.length - 1).x + 7, x));
    // The center tracks the finger immediately; dimensions ease toward each label.
    state.x = target.x = clamped;
    velocity.x = 0;
    moveTo(pressedShape(measured, clamped));
    paint();
    rim.style.setProperty('--shine-x', `${Math.max(15, Math.min(85, 50 + event.movementX * 2))}%`);
    tabs.forEach((tab, i) => tab.classList.toggle('drag-over', i === index));
  });
  function release(event, cancel = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const index = cancel ? selected : drag.moved ? nearest(target.x) : drag.index;
    const id = drag.id;
    drag = null;
    suppressClick = true;
    clearPressed();
    if (bar.hasPointerCapture(id)) bar.releasePointerCapture(id);
    select(index, { focus: !cancel, history: !cancel });
    setTimeout(() => { suppressClick = false; }, 0);
  }
  bar.addEventListener('pointerup', (event) => release(event));
  bar.addEventListener('pointercancel', (event) => release(event, true));
  bar.addEventListener('lostpointercapture', (event) => release(event, true));
  bar.addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; return; }
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  });
  bar.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drag) { release({ pointerId: drag.id }, true); return; }
    const next = { ArrowRight: (selected + 1) % tabs.length, ArrowLeft: (selected + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (next !== undefined) { event.preventDefault(); select(next, { focus: true }); }
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const index = tabs.findIndex((tab) => `#${tab.dataset.panel}` === link.hash);
      if (index < 0) return;
      event.preventDefault();
      select(index);
      document.getElementById(tabs[index].dataset.panel).focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
    });
  });
  window.addEventListener('hashchange', () => fromHash());
  fromHash(true);
  try {
    engine = new LiquidGlassEngine({ container: bar, filtered: surface, defsHost: bar.querySelector('.glass-defs') }, {
      width: state.width, height: state.height, radius: 'auto',
      strength: 0, chromaticAberration: 0, blur: 0,
      depth: 13, curvature: .82, glow: 0, edgeHighlight: 0,
      specular: 0, quality: 256,
    });
    // RGB arithmetic adds alpha three times on transparent surfaces.
    // Keep one full-color displacement so the clear track retains its alpha.
    const filter = bar.querySelector('filter');
    const displacements = [...filter.querySelectorAll('feDisplacementMap')];
    displacements[2].setAttribute('result', 'lensResult');
    filter.querySelectorAll('feColorMatrix').forEach(node => {
      if (['dispR', 'dispG', 'dispB'].includes(node.getAttribute('result'))) node.remove();
    });
    filter.querySelectorAll('feComposite').forEach(node => {
      if (node.getAttribute('in') === 'dispR' || node.getAttribute('in2') === 'dispB') node.remove();
    });
    bar.classList.add('has-refraction');
    paint();
  } catch (error) {
    surface.style.filter = '';
    bar.querySelector('.glass-defs').replaceChildren();
    console.warn('Glass refraction unavailable; using the accessible CSS tab indicator.', error);
  }
  new ResizeObserver(() => { if (!drag) moveTo(measure(selected), true); }).observe(surface);
  document.fonts.ready.then(() => { if (!drag) moveTo(measure(selected), true); });
  reduced.addEventListener('change', () => moveTo(measure(selected), true));
}

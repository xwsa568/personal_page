// Default to the requested white page; restore an explicit choice before paint.
(() => {
  let dark = false;
  try { dark = localStorage.getItem('my-space-theme') === 'dark'; } catch {}
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151517' : '#ffffff';
})();

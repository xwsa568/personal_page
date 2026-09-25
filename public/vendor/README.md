# Liquid Glass engine

`liquid-glass.js` is the framework-independent core of
[PallavAg/liquid-glass-web-react](https://github.com/PallavAg/liquid-glass-web-react),
bundled as a browser ES module without the React adapter.

- Upstream version: 0.1.1
- Pinned commit: `8c615458a0496a007a0fd1d3aa7a9716698f8f03`
- Source entry: `src/core/engine.ts`
- License: MIT, copyright 2026 Pallav Agarwal; see `liquid-glass.LICENSE`.
- Local change: explicit filter activation prevents asynchronous map and resize updates from re-enabling idle filters in Safari. `setLensFrame` scales a predecoded map to the animated lens bounds in one update without regenerating the map during interaction.

Reproduce from that upstream checkout:

```sh
npx --yes esbuild@0.25.10 src/core/engine.ts --bundle --format=esm --target=es2020 --outfile=liquid-glass.js
```

The file is served locally with the site; no third-party CDN or runtime package installation is needed.

The application integration in `../liquid-tabs.js` implements tab selection, spring motion,
pointer capture and keyboard accessibility. Its interaction direction references
[Aave's Building Glass for the Web](https://aave.com/design/building-glass-for-the-web).
No Aave source code is copied. This site is not affiliated with Apple, Aave, or the upstream library.

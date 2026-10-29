import { defineConfig } from 'astro/config';

// public/design-system and public/illustrations are symlinks to the shared repo-root folders,
// so the tool and the landing use the same /design-system/... and /illustrations/... paths.
export default defineConfig({
  trailingSlash: 'ignore',
  redirects: { '/directory': '/collection' }, // old address, renamed 29 Oct 2026
  devToolbar: { enabled: false },
  // shortcut: polling, because the native file watcher missed edits here (dev server kept serving stale CSS); drop it if HMR works without
  vite: { server: { watch: { usePolling: true, interval: 300, ignored: ['**/public/**', '**/dist/**'] } } },
});

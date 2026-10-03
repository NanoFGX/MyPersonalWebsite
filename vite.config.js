import { defineConfig } from 'vite';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Served from https://nanofgx.github.io/MyPersonalWebsite/ on GitHub Pages.
// Override with BASE_PATH=/ for a custom domain or local previews.
const base = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? '/MyPersonalWebsite/' : '/');

function prerender() {
  return {
    name: 'prerender-sections',
    async transformIndexHtml(html, ctx) {
      // Re-import on every request in dev so data edits show up without a restart.
      const stamp = ctx.server ? `?t=${Date.now()}` : '';
      const url = pathToFileURL(resolve(process.cwd(), 'src/build/render.js')).href;
      const { renderTemplate } = await import(url + stamp);
      return renderTemplate(html);
    },
  };
}

export default defineConfig({
  base,
  plugins: [prerender()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
});

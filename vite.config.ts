import { defineConfig } from 'vite';

export default ({ mode }) => {
  return defineConfig({
    base: mode === 'production' ? `https://canvas-radar.vercel.app/` : '/',
  });
};

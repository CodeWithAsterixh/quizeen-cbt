import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'node:path';

export default defineConfig(() => {
  const isWeb = Boolean(process.env.VERCEL || process.env.WEB_BUILD);

  return {
    plugins: [
      react(),
      ...(!isWeb
        ? [
            electron([
              { entry: 'electron/main.ts' },
              {
                entry: 'electron/preload.ts',
                onstart(options) {
                  options.reload();
                },
              },
            ]),
            renderer(),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@cbt/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      },
    },
    server: {
      port: 5174,
    },
    optimizeDeps: {
      include: ['@phosphor-icons/react'],
    },
  };
});

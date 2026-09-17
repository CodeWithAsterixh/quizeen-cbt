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
              {
                entry: 'electron/main.ts',
                onstart(options) {
                  options.startup();
                },
                vite: {
                  resolve: {
                    alias: {
                      '@cbt/shared': path.resolve(__dirname, '../../packages/shared/src/node.ts'),
                    },
                  },
                  build: {
                    rollupOptions: {
                      external: [
                        'electron',
                        'express',
                        'cors',
                        'ws',
                        'jszip',
                        /^node:.*/,
                      ],
                    },
                  },
                  define: {
                    'process.env.WS_NO_BUFFER_UTIL': '"true"',
                    'process.env.WS_NO_UTF_8_VALIDATE': '"true"',
                  },
                },
              },
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
        '@cbt/shared/src': path.resolve(__dirname, '../../packages/shared/src'),
        '@cbt/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      },
    },
    server: {
      port: 5176,
      strictPort: true,
    },
    define: {
      'process.env.WS_NO_BUFFER_UTIL': '"true"',
      'process.env.WS_NO_UTF_8_VALIDATE': '"true"',
    },
  };
});

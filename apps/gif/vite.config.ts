/// <reference types='vitest' />
import { defineConfig } from 'vite';
import {  join} from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/gif',
  server: {
    port: 4200,
    host: 'localhost',
  },
  resolve:{
    alias:{
      'react-best-gradient-color-picker/gradientParser':join(__dirname,"../../node_modules/react-best-gradient-color-picker/dist/esm/utils/gradientParser.js")
    }
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

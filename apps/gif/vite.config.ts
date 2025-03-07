/// <reference types='vitest' />
import { defineConfig } from 'vite';
import {  join} from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/gif',
  server: {
    port: 4200,
    host: '0.0.0.0',
  },
  resolve:{
    alias:{
      'react-best-gradient-color-picker/gradientParser':join(__dirname,"../../node_modules/react-best-gradient-color-picker/dist/esm/utils/gradientParser.js"),
      "@src":join(__dirname,"../gif/src"),
      "@node_modules":join(__dirname,"../../node_modules")
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

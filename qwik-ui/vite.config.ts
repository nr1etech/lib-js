import {paraglideVitePlugin} from '@inlang/paraglide-js';
import {defineConfig} from 'vite';
// @ts-ignore
import pkg from './package.json';
import {qwikVite} from '@builder.io/qwik/optimizer';
import {qwikCity} from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
const {dependencies = {}, peerDependencies = {}} = pkg as any;
const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);

export default defineConfig(({mode}) => {
  const isDevMode = mode === 'ssr';

  return {
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) =>
          `${entryName}.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        // externalize deps that shouldn't be bundled into the library
        external: [
          /^node:.*/,
          ...excludeAll(dependencies),
          ...excludeAll(peerDependencies),
        ],
      },
    },
    optimizeDeps: {
      exclude: ['@qwik-city-plan', '@qwik-city-sw-register'],
    },

    plugins: [
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: './src/paraglide',
      }),
      qwikVite(),
      ...(isDevMode ? [qwikCity()] : []),
      tsconfigPaths({root: '.'}),
      tailwindcss(),
    ],
  };
});

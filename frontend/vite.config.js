// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// // import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
// // import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
// // import rollupNodePolyfills from "rollup-plugin-node-polyfills";

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
//   // resolve: {
//   //   alias: {
//   //     stream: "stream-browserify",
//   //     events: "events-browserify",
//   //     buffer: "buffer",
//   //     util: "util",
//   //     os: "os-browserify/browser",
//   //   },
//   // },
//   // optimizeDeps: {
//   //   esbuildOptions: {
//   //     define: {
//   //       global: "globalThis",
//   //     },
//   //     plugins: [
//   //       NodeGlobalsPolyfillPlugin({
//   //         buffer: true,
//   //       }),
//   //       NodeModulesPolyfillPlugin(),
//   //     ],
//   //   },
//   // },
//   // build: {
//   //   rollupOptions: {
//   //     plugins: [rollupNodePolyfills()],
//   //   },
//   // },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});

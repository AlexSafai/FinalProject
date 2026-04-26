import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import { importMetaAssets } from "@web/rollup-plugin-import-meta-assets";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";

export default {
  input: "./index.html",
  output: {
    entryFileNames: "[name]-[hash].js",
    chunkFileNames: "[name]-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
    format: "es",
    dir: "public",
  },
  preserveEntrySignatures: false,
  plugins: [
    html(),
    nodeResolve({ exportConditions: ["browser", "default"] }),
    importMetaAssets(),
    esbuild({ target: "es2020", minify: true }),
  ],
};

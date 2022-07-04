import { BuildOptions } from "esbuild";
import path from "path";
import { CleanPlugin } from "./plugins/CleanPlugin";
import { HTMLPlugin } from "./plugins/HTMLPlugins";

const mode = process.env.MODE || "development";

const isDev = mode === "development";
const isProd = mode === "produciton";

const resolveRoot = (...segments: string[]) => {
  return path.resolve(__dirname, "..", "..", ...segments);
};

const config: BuildOptions = {
  outdir: resolveRoot("build"),
  entryPoints: [resolveRoot("src", "index.tsx")],
  entryNames: "[dir]/bundle.[hash]",
  bundle: true,
  tsconfig: resolveRoot("tsconfig.json"),
  minify: isProd,
  sourcemap: isDev,
  metafile: true,
  loader: {
    ".png": "file",
    ".webp": "file",
    ".svg": "file",
  },
  plugins: [CleanPlugin, HTMLPlugin({ title: "Esbuild" })],
  watch: isDev && {
    onRebuild(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("build");
      }
    },
  },
};

export default config;

import { Plugin } from "esbuild";
import { rm, writeFile } from "fs/promises";
import path from "path";

const preparePaths = (outputs: string[]): Array<string[]> => {
  return outputs.reduce<Array<string[]>>(
    (acc: string[][], path: string) => {
      const [js, css] = acc;
      const splittedFileName = path.split("/").pop();

      if (splittedFileName?.endsWith(".js")) {
        js.push(splittedFileName);
      } else if (splittedFileName?.endsWith(".css")) {
        css.push(splittedFileName);
      }

      return acc;
    },
    [[], []]
  );
};

interface HTMLPluginOptions {
  template?: string;
  title?: string;
  jsPath?: string[];
  cssPath?: string[];
}

const renderHTML = (options: HTMLPluginOptions) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${options?.cssPath
      ?.map((path) => `<link rel="stylesheet" href=${path}>`)
      .join("\n")}
    <title>${options.title}</title>
  </head>
  <body>
    <div id="app"></div>
    ${options?.jsPath
      ?.map((path) => `<script src=${path}></script>`)
      .join("\n")}
    <script>
      const eventSource = new EventSource('http://localhost:3000/subscribe');
      eventSource.onopen = function () { console.log('open') }
      eventSource.onerror = function () { console.log('error') }
      eventSource.onmessage = function () {
        console.log('open');
        window.location.reload();
      }
    </script>
  </body>
  </html>
  `;
};

export const HTMLPlugin = (options: HTMLPluginOptions): Plugin => {
  return {
    name: "HTMLPlugin",
    setup(build) {
      const outdir = build.initialOptions.outdir;

      build.onStart(async () => {
        try {
          const outdir = build.initialOptions.outdir;
          if (outdir) {
            await rm(outdir, { recursive: true });
          }
        } catch (err) {
          console.log("Не удалось очистить папку");
        }
      });

      build.onEnd(async (result) => {
        const outputs = result.metafile?.outputs;
        const [jsPath, cssPath] = preparePaths(Object.keys(outputs || {}));

        if (outdir) {
          await writeFile(
            path.resolve(outdir, "index.html"),
            renderHTML({ jsPath, cssPath, ...options })
          );
        }
      });
    },
  };
};

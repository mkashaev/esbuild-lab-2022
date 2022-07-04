import ESBuild from "esbuild";
import express from "express";
import path from "path";
import { EventEmitter } from "events";
import config from "./esbuild-config";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
const emmiter = new EventEmitter();

app.use(express.static(path.resolve(__dirname, "..", "..", "build")));

app.get("/subscribe", (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);
  res.write("");

  emmiter.on("refresh", () => {
    res.write("data: some message\n\n");
  });
});

function sendMessage() {
  emmiter.emit("refresh", "123");
}

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

ESBuild.build({
  ...config,
  watch: {
    onRebuild(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("build...");
        sendMessage();
      }
    },
  },
})
  .then((result) => {
    console.log("Builded");
  })
  .catch((err) => {
    console.log(err);
  });

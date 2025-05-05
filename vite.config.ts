import { defineConfig } from "vite";
import path from "node:path";
import { exec } from "node:child_process";

function zigWasmPlugin() {
  const zigDir = path.resolve(__dirname, "zig");

  return {
    name: "zig-wasm-watch",
    configureServer(server) {
      server.watcher.add(zigDir);
      server.watcher.on("change", (file) => {
        console.log(file, "changed");
        if (file.startsWith(zigDir)) {
          exec("npm run wasm", (_err, _stdout, stderr) => {
            console.error(stderr);
          });
        }
      });
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith(".wasm")) {
        const mods = server.moduleGraph.getModulesByFile(file);
        if (mods && mods.size) {
          return [...mods];
        }
      }
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname, "web"),
  plugins: [zigWasmPlugin()],
  server: {
    fs: { allow: ["."] },
  },
});

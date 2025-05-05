/// <reference types="vite/client" />

let wasm: {
  exports: {
    version: () => number;
  };
  memory: WebAssembly.Memory;
};

async function loadWasm() {
  const init = (await import("./bin/lib.wasm?init")).default;
  wasm = (await init()) as typeof wasm;
  console.log(wasm.exports.version());
}

loadWasm();

if (import.meta.hot) {
  import.meta.hot.accept("./bin/lib.wasm?init", () => {
    console.log("🔄 WASM rebuilt, re-loading…");
    loadWasm();
  });
}

console.log(new Date());

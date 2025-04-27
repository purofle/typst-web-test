import "./style.css";

import { createTypstCompiler, createTypstRenderer } from "@myriaddreamin/typst.ts";
import typst_ts_web_compiler_bg from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url";
import typst_ts_renderer_bg from "../node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url";

let cc = createTypstCompiler();
await cc.init({
  getModule: () => typst_ts_web_compiler_bg,
});
let render = createTypstRenderer();
await render.init({
    getModule: () => typst_ts_renderer_bg,
})

let mainTyp = await fetch("../main.typ").then(res => res.text());

cc.addSource("/main.typ", mainTyp);
let compile = await cc.compile({
  mainFilePath: "/main.typ",
  diagnostics: "full",
});

const container = document.getElementById("typst-app");
if (!container) {
  throw new Error("Container not found");
}

if (compile.result === undefined) {
  throw new Error("Compilation failed");
}

await render.renderToCanvas({
  format: "vector",
  artifactContent: compile.result,
  container,
  backgroundColor: "#343541",
  pixelPerPt: 3,
});
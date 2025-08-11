import stripJsonComments from "npm:strip-json-comments";
import * as path from "jsr:@std/path";
import { TextLineStream } from "jsr:@std/streams";

const tsconfigStorage = await Deno.makeTempDir({ prefix: "tsconfig" });

// Generate a tsconfig
const p = (new Deno.Command("npx", {
  args: ["-p", "typescript", "tsc", "--init"],
  stdout: "piped",
  cwd: tsconfigStorage,
})).spawn();

function readLines(stream: ReadableStream) {
  // https://github.com/denoland/deno/discussions/23495
  return stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
}

for await (const line of readLines(p.stdout!)) {
  console.warn(line);
}

let packageText = await Deno.readTextFile(
  path.join(tsconfigStorage, "tsconfig.json"),
);
// This will strip comments
const parsed = JSON.parse(stripJsonComments(packageText));

// `display` field will be dropped at generating npm package, so prevent the order from being last in the JSON file
parsed.display = "Recommended";
parsed["$schema"] = "https://json.schemastore.org/tsconfig";

const result = JSON.stringify(parsed, null, "  ");

const npmResponse = await fetch(
  `https://unpkg.com/@tsconfig/svelte/tsconfig.json`,
);
const npmPackage = await npmResponse.text();

if (npmPackage !== result) {
  Deno.writeTextFile("bases/recommended.json", result);
}

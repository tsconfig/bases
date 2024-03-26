import stripJsonComments from "https://esm.sh/strip-json-comments";
import * as bufio from "https://deno.land/std@0.164.0/io/buffer.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const tsconfigStorage = await Deno.makeTempDir({ prefix: "tsconfig" });

// Generate a tsconfig
const p = await Deno.run({ cmd: ["npx", "-p", "typescript", "tsc", "--init"], stdout: "piped", cwd: tsconfigStorage });
for await (const line of bufio.readLines(p.stdout!)) {
  console.warn(line);
}

let packageText = await Deno.readTextFile(path.join(tsconfigStorage, "tsconfig.json"));
// This will strip comments
const parsed = JSON.parse(stripJsonComments(packageText));

// `display` field will be dropped at generating npm package, so prevent the order from being last in the JSON file
parsed.display = "Recommended";
parsed["$schema"] = "https://json.schemastore.org/tsconfig";

const result = JSON.stringify(parsed, null, "  ");

const npmResponse = await fetch(`https://unpkg.com/@tsconfig/svelte/tsconfig.json`);
const npmPackage = await npmResponse.text();

if (npmPackage !== result) {
  Deno.writeTextFile("bases/recommended.json", result);
}

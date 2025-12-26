import { parse as parseJsonc } from "@std/jsonc";
import * as path from "@std/path";

const tsconfigStorage = await Deno.makeTempDir({ prefix: "tsconfig" });

// Generate a tsconfig
const cmd = new Deno.Command("npx", { args: ["-p", "typescript", "tsc", "--init"], stdout: "piped", cwd: tsconfigStorage });
const output = await cmd.output();
if (!output.success) throw new Error("Failed to run tsc --init")
console.warn(new TextDecoder().decode(output.stdout));

let packageText = await Deno.readTextFile(path.join(tsconfigStorage, "tsconfig.json"));
// This will strip comments
const parsed = parseJsonc(packageText);

// `display` field will be dropped at generating npm package, so prevent the order from being last in the JSON file
parsed.display = "Recommended";
parsed.$schema = "https://www.schemastore.org/tsconfig";

const result = JSON.stringify(parsed, null, 2);

const npmResponse = await fetch(`https://unpkg.com/@tsconfig/svelte/tsconfig.json`);
const npmPackage = await npmResponse.text();

if (npmPackage !== result) {
  Deno.writeTextFile("bases/recommended.json", result);
}

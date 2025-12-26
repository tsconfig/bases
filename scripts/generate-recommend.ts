import { parse as parseJsonc } from "@std/jsonc";
import * as path from "@std/path";

const tsconfigStorage = await Deno.makeTempDir({ prefix: "tsconfig" });

// Generate a tsconfig
const cmd = new Deno.Command("npx", {
  args: ["-p", "typescript", "tsc", "--init"],
  stdout: "piped",
  stderr: "piped",
  cwd: tsconfigStorage,
});

const output = await cmd.output();
const stdoutText = new TextDecoder().decode(output.stdout);
const stderrText = new TextDecoder().decode(output.stderr);

for (const line of stdoutText.split("\n")) {
  if (line) console.warn(line);
}
for (const line of stderrText.split("\n")) {
  if (line) console.warn(line);
}
if (!output.success) {
  throw new Error("Failed to generate tsconfig via npx tsc --init");
}

const packageText = await Deno.readTextFile(
  path.join(tsconfigStorage, "tsconfig.json"),
);
const parsed = parseJsonc(packageText) as Record<string, unknown>;

// `display` field will be dropped at generating npm package, so prevent the order from being last in the JSON file
parsed.display = "Recommended";
parsed.$schema = "https://www.schemastore.org/tsconfig";

const result = JSON.stringify(parsed, null, 2);

const npmResponse = await fetch(
  `https://unpkg.com/@tsconfig/svelte/tsconfig.json`,
);
const npmPackage = await npmResponse.text();

if (npmPackage !== result) {
  await Deno.writeTextFile("bases/recommended.json", `${result}\n`);
}

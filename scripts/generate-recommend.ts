import { deepMerge } from "@std/collections";
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

const versioned = {
  $schema: "https://www.schemastore.org/tsconfig",
  display: "Recommended",
  _version: "2.0.0",
};

// This is to get the _version property to show up directly under the display property
const parsedAndOrdered = deepMerge(versioned, parsed);
parsedAndOrdered.display = versioned.display;

const result = JSON.stringify(parsedAndOrdered, null, 2);

const npmResponse = await fetch(
  `https://unpkg.com/@tsconfig/svelte/tsconfig.json`,
);
const npmPackage = await npmResponse.text();

if (npmPackage !== result) {
  await Deno.writeTextFile("bases/recommended.json", `${result}\n`);
}

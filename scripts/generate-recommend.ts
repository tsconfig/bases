import {parse} from "./vendor/node-jsonc-parser/jsonc.ts"

// Generate a tsconfig
// await Deno.run({ cmd: ["npx", "-p", "typescript", "tsc", "--init"], stdout: "inherit" });

let packageText = await Deno.readTextFile("tsconfig.json")
const parsed = parse(packageText)

parsed["$schema"] = "https://json.schemastore.org/tsconfig",
parsed["display"] = "Node 10",

parsed["target"] = "ES2015",
const result = JSON.stringify(parsed, null, "  ")


const npmResponse = await fetch(`https://unpkg.com/@tsconfig/svelte/tsconfig.json`)
const npmPackage = await npmResponse.text()

if (npmPackage !== result) {
    Deno.writeTextFile("bases/recommended.json", result)
}


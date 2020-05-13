import * as path from "https://deno.land/std/path/mod.ts";

const decoder = new TextDecoder()
const file = Deno.stdin;

let stdin =""
while (true) {
  const c = new Uint8Array(8)
  if (await file.read(c) == null) {
    break
  }
  stdin += decoder.decode(c);
}

const fileInput = stdin.split("\n")
for (const tsconfig of fileInput) {
  if (!tsconfig.includes("bases/")) continue
  
  const name = path.basename(tsconfig).replace(".json", "")
  const packageDir = path.join("dist", name) 
  console.log(packageDir)

  // Deno.run({ cmd: ["pwd"], cwd: packageDir })
  Deno.run({ cmd: ["npm", "publish"], cwd: packageDir })
}

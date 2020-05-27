import * as path from "https://deno.land/std/path/mod.ts";
import * as bufio from "https://deno.land/std/io/bufio.ts";

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
  const packageDir = path.join("packages", name) 
  console.log(`Deploying ${packageDir}`)

  // Deno.run({ cmd: ["pwd"], cwd: packageDir })
  
  const process = Deno.run({
    cmd: ["npm", "publish", "--access", "public"],
    stdout: "piped",
    cwd: packageDir
  });
  
  for await (const line of bufio.readLines(process.stdout!)) {
    console.warn(line);
  }

  console.log(`Deployed\n`)
}

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
const toDeploy = new Set<string>()
for (const tsconfig of fileInput) {
  if (!tsconfig.includes("bases/")) continue
  toDeploy.add(path.basename(tsconfig))
}

for (const tsconfig of toDeploy) {
  const name = path.basename(tsconfig).replace(".json", "")
  const packageDir = path.join("packages", name) 
  console.log(`## Deploying ${packageDir}\n`)
  
  const process = Deno.run({
    cmd: ["npm", "publish", "--access", "public"],
    stdout: "piped",
    cwd: packageDir,
    env: { NODE_AUTH_TOKEN: Deno.env.get("NODE_AUTH_TOKEN")! }
  });
  
  for await (const line of bufio.readLines(process.stdout!)) {
    console.warn(line);
  }

  console.log(`Deployed\n`)
}

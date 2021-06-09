import * as path from "https://deno.land/std/path/mod.ts";
import * as bufio from "https://deno.land/std/io/bufio.ts";

// Loop through generated packages, deploying versions for anything which has a different tsconfig
const uploaded = []

for (const dirEntry of Deno.readDirSync("packages")) {
  const localTsconfigPath = path.join("packages", dirEntry.name, "tsconfig.json");
  const newTSConfig = Deno.readTextFileSync(localTsconfigPath);

  let upload = false;
  try {
    const unpkgURL = `https://unpkg.com/@tsconfig/${dirEntry.name}/tsconfig.json`;
    const currentJSONReq = await fetch(unpkgURL);
    const currentJSONTxt = await currentJSONReq.text();
    upload = currentJSONTxt !== newTSConfig;
  } catch (error) {
    // Not here, definitely needs to be uploaded
    upload = true;
  }

  if (upload) {
    const process = Deno.run({
      cmd: ["npm", "publish", "--access", "public"],
      stdout: "piped",
      cwd: path.join("packages", dirEntry.name),
      env: { NODE_AUTH_TOKEN: Deno.env.get("NODE_AUTH_TOKEN")! },
    });

    for await (const line of bufio.readLines(process.stdout!)) {
      console.warn(line);
    }

    uploaded.push(dirEntry.name)
  }
}

if (uploaded.length) {
  console.log("Uploaded: ", uploaded.join(", "))
} else {
  console.log("No uploads")
}
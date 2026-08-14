import * as path from "@std/path";

// Loop through generated packages, deploying versions for anything which has a different tsconfig
const uploaded = []

for await (const dirEntry of Deno.readDir("packages")) {
  if (dirEntry.name === 'bases') continue // @tsconfig/bases package is special, it doesn't have a single tsconfig entry, it will be deployed separately

  const localTsconfigPath = path.join("packages", dirEntry.name, "tsconfig.json");
  const newTSConfig = await Deno.readTextFile(localTsconfigPath);

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
    const cmd = new Deno.Command("npm", {
      args: ["publish", "--provenance", "--access", "public"],
      stdout: "piped",
      cwd: path.join("packages", dirEntry.name),
      env: { NODE_AUTH_TOKEN: Deno.env.get("NODE_AUTH_TOKEN")! },
    });
    const output = await cmd.output();
    if (!output.success) throw new Error(`Failed to publish ${dirEntry.name}`)
    console.warn(new TextDecoder().decode(output.stdout));

    uploaded.push(dirEntry.name)
  }
}

if (uploaded.length) {
  // If there's any uploads, we need to update the combined package too
    const cmd = new Deno.Command("npm", {
      args: ["publish", "--provenance", "--access", "public"],
      stdout: "piped",
      cwd: path.join("packages", "bases"),
      env: { NODE_AUTH_TOKEN: Deno.env.get("NODE_AUTH_TOKEN")! },
    });
    const output = await cmd.output();
    if (!output.success) throw new Error("Failed to publish bases")
    console.warn(new TextDecoder().decode(output.stdout));


  console.log("Uploaded: ", uploaded.join(", "))
} else {
  console.log("No uploads")
}

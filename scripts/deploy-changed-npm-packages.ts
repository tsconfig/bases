import * as path from "https://deno.land/std@0.164.0/path/mod.ts";

// Loop through generated packages, deploying versions for anything which has a different tsconfig
const uploaded = []

for (const dirEntry of Deno.readDirSync("packages")) {
  if (dirEntry.name === 'bases') continue // @tsconfig/bases package is special, it doesn't have a single tsconfig entry, it will be deployed separately

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
    await publishPackage(dirEntry.name);
    uploaded.push(dirEntry.name)
  }
}

if (uploaded.length) {
  // If there's any uploads, we need to update the combined package too
  await publishPackage("bases");

  console.log("Uploaded: ", uploaded.join(", "))
} else {
  console.log("No uploads")
}

async function publishPackage(name: string) {
  const process = new Deno.Command("npm", {
    args: ["publish", "--provenance", "--access", "public"],
    cwd: path.join("packages", name),
    stdin: "null",
    stdout: "inherit",
    stderr: "inherit",
  }).spawn();
  const status = await process.status;
  if (!status.success) {
    throw new Error(
      `npm publish failed for @tsconfig/${name} (exit code ${status.code}). ` +
      "If authentication failed, check this package's npm trusted publisher: " +
      "repository tsconfig/bases, workflow deploy.yml, and permission to run npm publish.",
    );
  }
}

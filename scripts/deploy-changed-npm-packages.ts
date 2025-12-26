import * as path from "@std/path";

// Loop through generated packages, deploying versions for anything which has a different tsconfig
const uploaded = [];

for await (const dirEntry of Deno.readDir("packages")) {
  if (dirEntry.name === "bases") continue; // @tsconfig/bases package is special, it doesn't have a single tsconfig entry, it will be deployed separately

  const localTsconfigPath = path.join(
    "packages",
    dirEntry.name,
    "tsconfig.json",
  );
  const newTSConfig = await Deno.readTextFile(localTsconfigPath);

  let upload = false;
  try {
    const unpkgURL =
      `https://unpkg.com/@tsconfig/${dirEntry.name}/tsconfig.json`;
    const currentJSONReq = await fetch(unpkgURL);
    const currentJSONTxt = await currentJSONReq.text();
    upload = currentJSONTxt !== newTSConfig;
  } catch (_error) {
    // Not here, definitely needs to be uploaded
    upload = true;
  }

  if (upload) {
    const token = Deno.env.get("NODE_AUTH_TOKEN");
    if (!token) throw new Error("NODE_AUTH_TOKEN is required");

    const cmd = new Deno.Command("npm", {
      args: ["publish", "--provenance", "--access", "public"],
      stdout: "piped",
      stderr: "piped",
      cwd: path.join("packages", dirEntry.name),
      env: { NODE_AUTH_TOKEN: token },
    });

    const output = await cmd.output();
    const stdoutText = new TextDecoder().decode(output.stdout);
    const stderrText = new TextDecoder().decode(output.stderr);
    if (stdoutText.trim()) console.warn(stdoutText.trimEnd());
    if (stderrText.trim()) console.warn(stderrText.trimEnd());
    if (!output.success) {
      throw new Error(`npm publish failed for ${dirEntry.name}`);
    }

    uploaded.push(dirEntry.name);
  }
}

if (uploaded.length) {
  // If there's any uploads, we need to update the combined package too
  const token = Deno.env.get("NODE_AUTH_TOKEN");
  if (!token) throw new Error("NODE_AUTH_TOKEN is required");

  const cmd = new Deno.Command("npm", {
    args: ["publish", "--provenance", "--access", "public"],
    stdout: "piped",
    stderr: "piped",
    cwd: path.join("packages", "bases"),
    env: { NODE_AUTH_TOKEN: token },
  });

  const output = await cmd.output();
  const stdoutText = new TextDecoder().decode(output.stdout);
  const stderrText = new TextDecoder().decode(output.stderr);
  if (stdoutText.trim()) console.warn(stdoutText.trimEnd());
  if (stderrText.trim()) console.warn(stderrText.trimEnd());
  if (!output.success) {
    throw new Error("npm publish failed for bases");
  }

  console.log("Uploaded: ", uploaded.join(", "));
} else {
  console.log("No uploads");
}

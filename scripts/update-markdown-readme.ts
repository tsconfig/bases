// deno run --allow-read --allow-write scripts/update-markdown-readme.ts
//

import { parse as parseJsonc } from "@std/jsonc";
import * as path from "@std/path";

const readme = await Deno.readTextFile("./README.md");
let center = "";

const paths = [];
for await (const tsconfigEntry of Deno.readDir("bases")) {
  if (!tsconfigEntry.isFile) continue;
  paths.push(tsconfigEntry.name);
}

const sortedPaths = paths
  .sort((l, r) => l.localeCompare(r))
  .filter((r) => !r.includes("recommended"));
const basePaths = ["recommended.json", ...sortedPaths];
for (const base of basePaths) {
  if (base === "esm.json") continue;
  const tsconfigFilePath = path.join("bases", base);
  const name = path.basename(base).replace(".json", "");

  const tsconfigText = await Deno.readTextFile(tsconfigFilePath);
  const tsconfigJSON = parseJsonc(tsconfigText) as { display: string };

  center +=
    `### ${tsconfigJSON.display} <kbd><a href="./bases/${base}">tsconfig.json</a></kbd>\n`;

  center += `
Install:

\`\`\`sh
npm install --save-dev @tsconfig/${name}
yarn add --dev @tsconfig/${name}
\`\`\`

`;

  const hasReadmeExtra = await Deno.stat(`./readme-extras/${name}.md`)
    .then(() => true)
    .catch(() => false);
  const readmeExtra = hasReadmeExtra
    ? (await Deno.readTextFile(`./readme-extras/${name}.md`)).trim()
    : "";

  const defaultInstructions = `Add to your \`tsconfig.json\`:

\`\`\`json
"extends": "@tsconfig/${name}/tsconfig.json"
\`\`\`

`;

  if (readmeExtra) {
    if (!readmeExtra.includes("extends")) {
      center += `${defaultInstructions}\n`;
    }

    center += `\n${readmeExtra}\n\n`;
  } else {
    center += defaultInstructions;
  }
}

const startMarker = "<!-- AUTO -->";
const start = readme.split(startMarker)[0];
const endMarker = "<!-- /AUTO -->";
const end = readme.split(endMarker)[1];
const newREADME = `${start}${startMarker}\n${center}\n${endMarker}${end}`;

await Deno.writeTextFile("./README.md", newREADME);

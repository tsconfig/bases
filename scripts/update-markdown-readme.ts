// deno run --allow-read --allow-write scripts/update-markdown-readme.ts
//
import * as path from "https://deno.land/std/path/mod.ts";
import stripJsonComments from "https://esm.sh/strip-json-comments";

const readme = await Deno.readTextFileSync("./README.md")
let center = ""

const paths = []
for await (const tsconfigEntry of Deno.readDir("bases")) {
  if (!tsconfigEntry.isFile) continue
  paths.push(tsconfigEntry.name)
}

const sortedPaths = paths.sort((l, r) => l.localeCompare(r)).filter(r => !r.includes("recommended"))
const basePaths = ["recommended.json", ...sortedPaths]
for (const base of basePaths) {
  const tsconfigFilePath = path.join("bases", base)
  const name = path.basename(base).replace(".json", "").replace(".combined", "")
  
  const tsconfigText = await Deno.readTextFile(tsconfigFilePath)
  const tsconfigJSON = JSON.parse(stripJsonComments(tsconfigText))

  center += `### ${tsconfigJSON.display} <kbd><a href="./bases/${base}">tsconfig.json</a></kbd>\n`

  center += `
Install:

\`\`\`sh
npm install --save-dev @tsconfig/${name}
yarn add --dev @tsconfig/${name}
\`\`\`

Add to your \`tsconfig.json\`:

\`\`\`json
"extends": "@tsconfig/${name}/tsconfig.json"
\`\`\`
`

  try {
    const readmeExtra = (await Deno.readTextFile(`./readme-extras/${name}.md`)).trim()

    if (readmeExtra)
      center += `\n${readmeExtra}\n`
  } catch (error) {}
};

const startMarker ="<!-- AUTO -->"
const start = readme.split(startMarker)[0]
const endMarker ="<!-- /AUTO -->"
const end = readme.split(endMarker)[1]
const newREADME = start + startMarker +  "\n" + center + "\n" + endMarker  + end

await Deno.writeTextFileSync("./README.md", newREADME)

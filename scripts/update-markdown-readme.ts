// deno run --allow-read --allow-write scripts/update-markdown-readme.ts
//
import * as path from "https://deno.land/std/path/mod.ts";

const readme = await Deno.readTextFileSync("./README.md")
let center = ""

for await (const tsconfigEntry of Deno.readDir("bases")) {
  if (!tsconfigEntry.isFile) continue
  
  const tsconfigFilePath = path.join("bases", tsconfigEntry.name)
  const name = path.basename(tsconfigEntry.name).replace(".json", "")
  
  const tsconfigText = await Deno.readTextFile(tsconfigFilePath)
  const tsconfigJSON = JSON.parse(tsconfigText)

  center += `### ${tsconfigJSON.display}\n`

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
}

const startMarker ="<!-- AUTO -->"
const start = readme.split(startMarker)[0]
const endMarker ="<!-- /AUTO -->"
const end = readme.split(endMarker)[1]
const newREADME = start + startMarker +  "\n" + center + "\n" + endMarker  + end

await Deno.writeTextFileSync("./README.md", newREADME)

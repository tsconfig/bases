import * as path from "https://deno.land/std/path/mod.ts";
import stripJsonComments from "https://esm.sh/strip-json-comments";

for await (const tsconfigEntry of Deno.readDir("bases")) {
  if (!tsconfigEntry.isFile) continue
  
  const tsconfigFilePath = path.join("bases", tsconfigEntry.name)
  const name = path.basename(tsconfigEntry.name).replace(".json", "")

  // Make the folder
  const packagePath = path.join("packages", name)
  Deno.mkdirSync(packagePath, { recursive: true })

  // Copy over the template files
  const templateDir = "./template"
  for await (const templateFile of Deno.readDir(templateDir)) {
    if (!templateFile.isFile) continue
    if (templateFile.name === "README-combined.md") continue // README-combined.md is only for the combined bases
    const templatedFile = path.join(templateDir, templateFile.name)
    Deno.copyFileSync(templatedFile, path.join(packagePath, templateFile.name))
  }
  
  // Copy the create a tsconfig.json from the base json
  const newPackageTSConfigPath = path.join(packagePath, "tsconfig.json")
  Deno.copyFileSync(tsconfigFilePath, newPackageTSConfigPath)
  
  const tsconfigText = await Deno.readTextFile(newPackageTSConfigPath)
  const tsconfigJSON = JSON.parse(stripJsonComments(tsconfigText))

// Drop `display` field in tsconfig.json for npm package 
  await Deno.writeTextFile(newPackageTSConfigPath, tsconfigText.replace(/\s*"display.*/,''))

  // Edit the package.json
  const packageText = await Deno.readTextFile(path.join(packagePath, "package.json"))
  const packageJSON = JSON.parse(packageText)
  packageJSON.name = `@tsconfig/${name}`
  packageJSON.description = `A base TSConfig for working with ${tsconfigJSON.display}.`
  packageJSON.keywords = ["tsconfig", name]

  // Do some string replacements in the other templated files
  const replaceTextIn = ["README.md"]
  for (const filenameToEdit of replaceTextIn) {
    const fileToEdit =  path.join(packagePath, filenameToEdit)
  
    const defaultTitle = `A base TSConfig for working with ${tsconfigJSON.display}`
    const title = name !== "recommended" ? defaultTitle : "The recommended base for a TSConfig"

    let packageText = await Deno.readTextFile(fileToEdit)
    packageText = packageText.replace(/\[filename\]/g, name)
                             .replace(/\[display_title\]/g, title)
                             .replace(/\[tsconfig\]/g, Deno.readTextFileSync(newPackageTSConfigPath))
    
    // Inject readme-extra if any
    try {
      const readmeExtra = (await Deno.readTextFile(path.join("readme-extras", `${name}.md`))).trim()
      
      if (readmeExtra)
        packageText = packageText.replace(/\[readme-extra\]/g, `\n${readmeExtra}\n`)
    } catch (error) {
      // NOOP, there is no extra readme 
      // console.log(error)
    }
    
    // Remove readme-extra placeholders if any
    packageText = packageText.replace(/\[readme-extra\]/g, '')

    await Deno.writeTextFile(fileToEdit, packageText)
  };

  // Bump the last version of the number from npm,
  // or use the _version in tsconfig if it's higher,
  // or default to 1.0.0
  let version = tsconfigJSON._version || "1.0.0"
  try {
    const npmResponse = await fetch(`https://registry.npmjs.org/${packageJSON.name}`)
    const npmPackage = await npmResponse.json()

    const semverMarkers = npmPackage["dist-tags"].latest.split(".");
    const bumpedVersion = `${semverMarkers[0]}.${semverMarkers[1]}.${Number(semverMarkers[2]) + 1}`;
    if (isBumpedVersionHigher(version, bumpedVersion)) {
      version = bumpedVersion;
    }
  } catch (error) {
    // NOOP, this is for the first deploy 
    // console.log(error)
  }
  
  packageJSON.version = version
  await Deno.writeTextFile(path.join(packagePath, "package.json"), JSON.stringify(packageJSON, null, "  "))

  console.log("Built:", tsconfigEntry.name);
}

await buildTsconfigBases()

function isBumpedVersionHigher (packageJSONVersion: string, bumpedVersion: string) {
  const semverMarkersPackageJSON = packageJSONVersion.split('.')
  const semverMarkersBumped = bumpedVersion.split('.')
  for (let i = 0; i < 3; i++) {
    if (Number(semverMarkersPackageJSON[i]) > Number(semverMarkersBumped[i])) {
      return false
    }
  }

  return true
}

// build @tsconfig/bases catch all package
async function buildTsconfigBases() {
  const name = "bases"

  // Make the folder
  const packagePath = path.join("packages", name)
  Deno.mkdirSync(packagePath, { recursive: true })

  // Copy over the template files
  const templateDir = "./template"
  for await (const templateFile of Deno.readDir(templateDir)) {
    if (!templateFile.isFile) continue
    if (templateFile.name === "README.md") continue
    const templatedFile = path.join(templateDir, templateFile.name)
    Deno.copyFileSync(
      templatedFile,
      path.join(
        packagePath,
        templateFile.name === "README-combined.md" ? "README.md" : templateFile.name,
      ),
    )
  }

  const exportsOverride = {}

  // Copy the tsconfig.json files from all bases
  for await (const tsconfigEntry of Deno.readDir("bases")) {
    if (!tsconfigEntry.isFile) continue

    // remove extension
    const name = tsconfigEntry.name.replace(/\.json$/, "")

    const finalTsconfigFile = `${name}.tsconfig.json`

    // add entry to package.json exports
    exportsOverride[`./${name}`] = `./${finalTsconfigFile}`

    const tsconfigFilePath = path.join("bases", tsconfigEntry.name)

    const newPackageTSConfigPath = path.join(packagePath, finalTsconfigFile)

    Deno.copyFileSync(tsconfigFilePath, newPackageTSConfigPath)

    const tsconfigText = await Deno.readTextFile(newPackageTSConfigPath)

    // Drop `display` field in tsconfig.json for npm package
    await Deno.writeTextFile(newPackageTSConfigPath, tsconfigText.replace(/\s*"display.*/, ""))
  }

  const tsconfigJSON = { display: "Bases" }

  // Edit the package.json
  const packageText = await Deno.readTextFile(path.join(packagePath, "package.json"))
  const packageJSON = JSON.parse(packageText)
  packageJSON.name = `@tsconfig/${name}`
  packageJSON.description = `Combined tsconfig bases.`
  packageJSON.keywords = ["tsconfig", name, "combined"]
  packageJSON.exports = exportsOverride

  // Do some string replacements in the other templated files
  const replaceTextIn = ["README.md"]
  for (const filenameToEdit of replaceTextIn) {
    const fileToEdit = path.join(packagePath, filenameToEdit)

    const defaultTitle = `A base TSConfig for working with ${tsconfigJSON.display}`
    const title = name !== "recommended" ? defaultTitle : "The recommended base for a TSConfig"

    let packageText = await Deno.readTextFile(fileToEdit)
    packageText = packageText.replace(/\[filename\]/g, name).replace(/\[display_title\]/g, title)

    // Inject readme-extra if any
    try {
      const readmeExtra = (await Deno.readTextFile(path.join("readme-extras", `${name}.md`))).trim()

      if (readmeExtra) {
        packageText = packageText.replace(/\[readme-extra\]/g, `\n${readmeExtra}\n`)
      }
    } catch (error) {
      // NOOP, there is no extra readme
      // console.log(error)
    }

    // Remove readme-extra placeholders if any
    packageText = packageText.replace(/\[readme-extra\]/g, "")

    await Deno.writeTextFile(fileToEdit, packageText)
  }

  // Bump the last version of the number from npm,
  // or use the _version in tsconfig if it's higher,
  // or default to 1.0.0
  let version = tsconfigJSON._version || "1.0.0"
  try {
    const npmResponse = await fetch(`https://registry.npmjs.org/${packageJSON.name}`)
    const npmPackage = await npmResponse.json()

    const semverMarkers = npmPackage["dist-tags"].latest.split(".")
    const bumpedVersion = `${semverMarkers[0]}.${semverMarkers[1]}.${Number(semverMarkers[2]) + 1}`
    if (isBumpedVersionHigher(version, bumpedVersion)) {
      version = bumpedVersion
    }
  } catch (error) {
    // NOOP, this is for the first deploy
    // console.log(error)
  }

  packageJSON.version = version
  await Deno.writeTextFile(
    path.join(packagePath, "package.json"),
    JSON.stringify(packageJSON, null, "  "),
  )

  console.log("Built:", "bases")
}

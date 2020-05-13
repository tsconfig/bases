import * as path from "https://deno.land/std/path/mod.ts";

for await (const tsconfigEntry of Deno.readDir("bases")) {
  if (!tsconfigEntry.isFile) continue
  
  const tsconfigFilePath = path.join("bases", tsconfigEntry.name)
  const name = path.basename(tsconfigEntry.name).replace(".json", "")

  // Make the folder
  const packagePath = path.join("dist", name)
  Deno.mkdirSync(packagePath, { recursive: true })

  // Copy over the template files
  const templateDir = "./template"
  for await (const templateFile of Deno.readDir(templateDir)) {
    if (!templateFile.isFile) continue
    const templatedFile = path.join(templateDir, templateFile.name)
    Deno.copyFileSync(templatedFile, path.join(packagePath, templateFile.name))
  }
  
  // Copy the create a tsconfig.json from the base json
  const newPackageTSConfigPath = path.join(packagePath, "tsconfig.json")
  Deno.copyFileSync(tsconfigFilePath, newPackageTSConfigPath)
  
  const tsconfigText = await Deno.readTextFile(newPackageTSConfigPath)
  const tsconfigJSON = JSON.parse(tsconfigText)

  // Edit the package.json
  const packageText = await Deno.readTextFile(path.join(packagePath, "package.json"))
  const packageJSON = JSON.parse(packageText)
  packageJSON.name = `@tsconfig/${name}`

  // Do some string replacements in the other templated files
  const replaceTextIn = ["README.md"]
  for (const filenameToEdit of replaceTextIn) {
    const fileToEdit =  path.join(packagePath, filenameToEdit)
  
    let packageText = await Deno.readTextFile(fileToEdit)
    packageText = packageText.replace(/\[filename\]/g, name).replace(/\[display\]/g, tsconfigJSON.display)

    await Deno.writeTextFile(fileToEdit, packageText)
  };

  // Bump the last version of the number from npm, or default to 1.0.0
  let version = "1.0.0"
  try {
    const npmResponse = await fetch(`https://registry.npmjs.org/${packageJSON.name}`)
    const npmPackage = JSON.parse(await npmResponse.json())

    const semverMarkers = npmPackage.version.split(".");
    version = `${semverMarkers[0]}.${semverMarkers[1]}.${Number(semverMarkers[2]) + 1}`;
  } catch (error) {
    // NOOP, this is for the first deploy 
  }
  
  packageJSON.version = version
  await Deno.writeTextFile(path.join(packagePath, "package.json"), JSON.stringify(packageJSON))

  console.log("Built:", tsconfigEntry.name);
}


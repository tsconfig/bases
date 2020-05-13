## Centralized Recommendations for TSConfig bases

Hosts base TSConfigs for particular environments supported and improved by the community. 
Basically Definitely Typed for TSConfigs.

In this repo:

<!-- AUTO -->
### Node 12

Install:

```sh
npm install --save-dev @tsconfig/node12
yarn add --dev @tsconfig/node12
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node12/tsconfig.json"
```
### Node 10

Install:

```sh
npm install --save-dev @tsconfig/node10
yarn add --dev @tsconfig/node10
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node10/tsconfig.json"
```

<!-- /AUTO -->

### Contributing

```sh
git clone https://github.com/tsconfig/bases.git tsconfig-bases
cd tsconfig-bases
```

Then edit the tsconfig.json files in [`bases/`](./bases).

Every morning there is a GitHub Action which deploys any changed bases.

### Developing

Create a set of npm packages via:

```sh
deno run --allow-read --allow-write scripts/create-npm-packages.ts
```

You can inspect them in the `dist/` folder, then they are deployed by passing in the paths to the base files via stdin: 

```sh
echo bases/node10.json | deno run --allow-read --allow-run scripts/deploy-npm-packages.ts  
```

The rest of the files in this repo are for deploying, which uses [Deno](https://deno.land) 1.0.

If you add a new json file, please run `deno run --allow-read --allow-write scripts/update-markdown-readme.ts` to update the README.

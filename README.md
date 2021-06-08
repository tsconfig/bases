## Centralized Recommendations for TSConfig bases

Hosts TSConfigs for you to extend in your apps, tuned to a particular runtime environment. Owned and improved by the community.
Basically Definitely Typed for TSConfigs.

### Available TSConfigs

<!-- AUTO -->
### Recommended <kbd><a href="./bases/recommended.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/recommended
yarn add --dev @tsconfig/recommended
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/recommended/tsconfig.json"
```
### Create React App <kbd><a href="./bases/create-react-app.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/create-react-app
yarn add --dev @tsconfig/create-react-app
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/create-react-app/tsconfig.json"
```
### Deno <kbd><a href="./bases/deno.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/deno
yarn add --dev @tsconfig/deno
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/deno/tsconfig.json"
```
### Docusaurus v2 <kbd><a href="./bases/docusaurus.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/docusaurus
yarn add --dev @tsconfig/docusaurus
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/docusaurus/tsconfig.json"
```
### Next.js <kbd><a href="./bases/next.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/next
yarn add --dev @tsconfig/next
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/next/tsconfig.json"
```
### Node 10 <kbd><a href="./bases/node10.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node10
yarn add --dev @tsconfig/node10
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node10/tsconfig.json"
```
### Node 12 <kbd><a href="./bases/node12.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node12
yarn add --dev @tsconfig/node12
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node12/tsconfig.json"
```
### Node 14 <kbd><a href="./bases/node14.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node14
yarn add --dev @tsconfig/node14
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node14/tsconfig.json"
```
### Node 16 <kbd><a href="./bases/node16.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node16
yarn add --dev @tsconfig/node16
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node16/tsconfig.json"
```
### Nuxt <kbd><a href="./bases/nuxt.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/nuxt
yarn add --dev @tsconfig/nuxt
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/nuxt/tsconfig.json"
```
### React Native <kbd><a href="./bases/react-native.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/react-native
yarn add --dev @tsconfig/react-native
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/react-native/tsconfig.json"
```
### Svelte <kbd><a href="./bases/svelte.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/svelte
yarn add --dev @tsconfig/svelte
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/svelte/tsconfig.json"
```
### Cypress <kbd><a href="./bases/cypress.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/cypress
yarn add --dev @tsconfig/cypress
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/cypress/tsconfig.json"
```

<!-- /AUTO -->

### Contributing

```sh
git clone https://github.com/tsconfig/bases.git tsconfig-bases
cd tsconfig-bases
```

Then edit the tsconfig.json files in [`bases/`](./bases).

Every morning there is a GitHub Action which deploys any changed bases.

To generate the recommended TSConfig which is generated via `tsc --init`, run:

```sh
deno run --allow-read --allow-run --allow-env --allow-write --allow-net scripts/generate-recommend.ts
```

### Developing

Create a set of npm packages via:

```sh
deno run --allow-read --allow-write --allow-net scripts/create-npm-packages.ts
```

You can inspect them in the `packages/` folder, then they are deployed by passing in the paths to the base files via stdin:

```sh
echo bases/node10.json | deno run --allow-read --allow-run --allow-env scripts/deploy-npm-packages.ts
```

or to send in changes from the last 3 weeks:

```sh
git log --pretty=format: --name-only --since="21 days ago" bases | deno run --allow-read --allow-run --allow-env scripts/deploy-npm-packages.ts
```

The rest of the files in this repo are for deploying, which uses [Deno](https://deno.land) 1.0.

If you add a new json file, please run `deno run --allow-read --allow-write scripts/update-markdown-readme.ts` to update the README.

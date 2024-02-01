## Centralized Recommendations for TSConfig bases

Hosts TSConfigs for you to extend in your apps, tuned to a particular runtime environment. Owned and improved by the community.
Basically Definitely Typed for TSConfigs.

We target the latest versions stable version of TypeScript, note that because we want to be consistent with the versioning the target runtime we can't always do semver releases.

### Table of TSConfigs

| Name                                               | Package                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Recommended](#recommended-tsconfigjson)           | [`@tsconfig/recommended`](https://npmjs.com/package/@tsconfig/recommended)           |
| [Bun](#bun-tsconfigjson)                           | [`@tsconfig/bun`](https://npmjs.com/package/@tsconfig/bun)                           |
| [Create React App](#create-react-app-tsconfigjson) | [`@tsconfig/create-react-app`](https://npmjs.com/package/@tsconfig/create-react-app) |
| [Cypress](#cypress-tsconfigjson)                   | [`@tsconfig/cypress`](https://npmjs.com/package/@tsconfig/cypress)                   |
| [Deno](#deno-tsconfigjson)                         | [`@tsconfig/deno`](https://npmjs.com/package/@tsconfig/deno)                         |
| [Docusaurus v2](#docusaurus-v2-tsconfigjson)       | [`@tsconfig/docusaurus`](https://npmjs.com/package/@tsconfig/docusaurus)             |
| [Ember](#ember-tsconfigjson)                       | [`@tsconfig/ember`](https://npmjs.com/package/@tsconfig/ember)                       |
| [Next.js](#nextjs-tsconfigjson)                    | [`@tsconfig/next`](https://npmjs.com/package/@tsconfig/next)                         |
| [Node LTS](#node-lts-tsconfigjson)                 | [`@tsconfig/node-lts`](https://npmjs.com/package/@tsconfig/node-lts)                 |
| [Node 10](#node-10-tsconfigjson)                   | [`@tsconfig/node10`](https://npmjs.com/package/@tsconfig/node10)                     |
| [Node 12](#node-12-tsconfigjson)                   | [`@tsconfig/node12`](https://npmjs.com/package/@tsconfig/node12)                     |
| [Node 14](#node-14-tsconfigjson)                   | [`@tsconfig/node14`](https://npmjs.com/package/@tsconfig/node14)                     |
| [Node 16](#node-16-tsconfigjson)                   | [`@tsconfig/node16`](https://npmjs.com/package/@tsconfig/node16)                     |
| [Node 17](#node-17-tsconfigjson)                   | [`@tsconfig/node17`](https://npmjs.com/package/@tsconfig/node17)                     |
| [Node 18](#node-18-tsconfigjson)                   | [`@tsconfig/node18`](https://npmjs.com/package/@tsconfig/node18)                     |
| [Node 19](#node-19-tsconfigjson)                   | [`@tsconfig/node19`](https://npmjs.com/package/@tsconfig/node19)                     |
| [Node 20](#node-20-tsconfigjson)                   | [`@tsconfig/node20`](https://npmjs.com/package/@tsconfig/node20)                     |
| [Node 21](#node-21-tsconfigjson)                   | [`@tsconfig/node21`](https://npmjs.com/package/@tsconfig/node21)                     |
| [Nuxt](#nuxt-tsconfigjson)                         | [`@tsconfig/nuxt`](https://npmjs.com/package/@tsconfig/nuxt)                         |
| [React Native](#react-native-tsconfigjson)         | [`@tsconfig/react-native`](https://npmjs.com/package/@tsconfig/react-native)         |
| [Remix](#remix-tsconfigjson)                       | [`@tsconfig/remix`](https://npmjs.com/package/@tsconfig/remix)                       |
| [Strictest](#strictest-tsconfigjson)               | [`@tsconfig/strictest`](https://npmjs.com/package/@tsconfig/strictest)               |
| [Svelte](#svelte-tsconfigjson)                     | [`@tsconfig/svelte`](https://npmjs.com/package/@tsconfig/svelte)                     |
| [Taro](#taro-tsconfigjson)                         | [`@tsconfig/taro`](https://npmjs.com/package/@tsconfig/taro)                         |
| [Vite React](#vite-react-tsconfigjson)             | [`@tsconfig/vite-react`](https://npmjs.com/package/@tsconfig/vite-react)             |

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
### Bun <kbd><a href="./bases/bun.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/bun
yarn add --dev @tsconfig/bun
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/bun/tsconfig.json"
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

> **NOTE**: You may need to add `"baseUrl": "."` to your `tsconfig.json` to support proper file resolution.
### Ember <kbd><a href="./bases/ember.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/ember
yarn add --dev @tsconfig/ember
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/ember/tsconfig.json"
```

> **NOTE**: You may need to add `"baseUrl": "."` to your `tsconfig.json` to support proper file resolution.
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
### Node LTS <kbd><a href="./bases/node-lts.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node-lts
yarn add --dev @tsconfig/node-lts
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node-lts/tsconfig.json"
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
### Node 17 <kbd><a href="./bases/node17.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node17
yarn add --dev @tsconfig/node17
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node17/tsconfig.json"
```
### Node 18 <kbd><a href="./bases/node18.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node18
yarn add --dev @tsconfig/node18
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node18/tsconfig.json"
```
### Node 19 <kbd><a href="./bases/node19.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node19
yarn add --dev @tsconfig/node19
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node19/tsconfig.json"
```
### Node 20 <kbd><a href="./bases/node20.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node20
yarn add --dev @tsconfig/node20
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node20/tsconfig.json"
```
### Node 21 <kbd><a href="./bases/node21.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/node21
yarn add --dev @tsconfig/node21
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node21/tsconfig.json"
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

> **NOTE**: You may need to add `"baseUrl": "."` to your `tsconfig.json` to support proper file resolution.
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
### Remix <kbd><a href="./bases/remix.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/remix
yarn add --dev @tsconfig/remix
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/remix/tsconfig.json"
```

> **NOTE**: You may need to add `"baseUrl": "."` to your `tsconfig.json` to support proper file resolution.
### Strictest <kbd><a href="./bases/strictest.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/strictest
yarn add --dev @tsconfig/strictest
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/strictest/tsconfig.json"
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

> **NOTE**: After `@tsconfig/svelte@2.0.0`, you should add `/// <reference types="svelte" />` to a `d.ts` or a `index.ts`(entry) file to prevent typescript error.
### Taro <kbd><a href="./bases/taro.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/taro
yarn add --dev @tsconfig/taro
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/taro/tsconfig.json"
```
### Vite React <kbd><a href="./bases/vite-react.json">tsconfig.json</a></kbd>

Install:

```sh
npm install --save-dev @tsconfig/vite-react
yarn add --dev @tsconfig/vite-react
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/vite-react/tsconfig.json"
```

<!-- /AUTO -->

### What about combined configs?

Because of previous limitations in the config extension system of TypeScript,
this repo used to provide combined configs from a few common bases (like Node + ESM,
Node + Strictest and so on).

This issue is now moot since TypeScript v5.0.0, which provides the [ability to 
extend from multiple configs at once](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-rc/#supporting-multiple-configuration-files-in-extends). For instance, if you want
to start from a Node 18 + Strictest base config, you can install both
`@tsconfig/node18` and `@tsconfig/strictest` packages and extend those configs like so:

```jsonc
// tsconfig.json
{
  "extends": ["@tsconfig/strictest/tsconfig", "@tsconfig/node18/tsconfig"]
}
```

You can see the result of the combined configs via `tsc --showConfig`.

### What about `@tsconfig/esm`?

We deprecated it in favour of setting [module/moduleResolution](https://github.com/tsconfig/bases/pull/197) to node/bundler.

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
deno run --allow-read --allow-run --allow-env --allow-net scripts/deploy-changed-npm-packages.ts
```

The rest of the files in this repo are for deploying, which uses [Deno](https://deno.land) 1.0.

If you add a new json file, please run `deno run --allow-read --allow-write scripts/update-markdown-readme.ts` to update the README.

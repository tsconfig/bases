### [display_title].

Add the package to your `"devDependencies"`:

```sh
npm install --save-dev @tsconfig/[filename]
yarn add --dev @tsconfig/[filename]
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/[filename]/<base>"
# eg "extends": "@tsconfig/[filename]/node-lts"
```

You can find the [code here](https://github.com/tsconfig/bases/blob/master/bases/).

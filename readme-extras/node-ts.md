> **NOTE**: This `tsconfig` base will **only** work in TypeScript versions 5.8
> and beyond. (See [announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option))

# Important (read it before usage)

This file is meant to be used in conjunction with other Node.js configurations, you can do so by extending multiple files in the `extends` clause of your `tsconfig.json`:

```json
{
  "extends": ["@tsconfig/node22/tsconfig.json", "@tsconfig/node-ts/tsconfig.json"]
}
```

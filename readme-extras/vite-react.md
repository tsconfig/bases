For Vite React projects that use separate application and Node configurations,
add the preset to `tsconfig.app.json`:

```json
{
  "extends": "@tsconfig/vite-react/tsconfig.json",
  "include": ["src"]
}
```

Keep your application's existing `include` entries and any additional compiler
options. Leave the root `tsconfig.json` project references intact, pointing to
`tsconfig.app.json` and `tsconfig.node.json`; the application preset belongs in
the application configuration rather than the root or Node configuration.

For projects with a single configuration, add the `extends` entry to that
application's `tsconfig.json` instead.

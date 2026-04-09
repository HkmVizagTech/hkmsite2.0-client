import { defineConfig, globalIgnores } from "eslint/config";

// Temporary debug: isolate which shared config triggers 'Plugin "" not found.'
// We'll try each config individually. If the error persists, revert to original.
const eslintConfig = defineConfig([
  {
    // Use named extends provided by eslint-config-next and TypeScript plugin
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  },
  // Keep default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

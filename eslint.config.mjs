import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "no-undef": "off",
      "@next/next/no-img-element": "off",
      "import/no-anonymous-default-export": "off",
      "no-irregular-whitespace": "off",
      "no-empty": "off",
    },
  },
];

export default eslintConfig;

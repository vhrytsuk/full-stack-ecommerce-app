import rootConfig from "../../eslint.config.js";

export default [
  ...rootConfig,
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];

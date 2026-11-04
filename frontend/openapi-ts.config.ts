import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "../backend/openapi.json",
  output: "src/api/generated",
  plugins: ["@tanstack/react-query", { name: "@hey-api/typescript", enums: "javascript" }],
})

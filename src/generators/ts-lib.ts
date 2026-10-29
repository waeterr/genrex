import type { ProjectConfig } from "../config.js";
import type { GeneratedFile } from "../generator.js";
import { generateCiWorkflow } from "../ci.js";

export function buildTsLibFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: config.name,
          version: "0.1.0",
          type: "module",
          main: "./dist/index.js",
          types: "./dist/index.d.ts",
          exports: {
            ".": {
              import: "./dist/index.js",
              types: "./dist/index.d.ts",
            },
          },
          files: ["dist"],
          scripts: {
            build: "tsc",
            test: "vitest run",
            format: "biome format --write .",
            lint: "biome check .",
            prepublishOnly: "npm run build && npm test",
          },
          devDependencies: {
            "@biomejs/biome": "^1.9.0",
            "@types/node": "^22.0.0",
            typescript: "^5.8.0",
            vitest: "^2.1.0",
          },
        },
        null,
        2,
      ) + "\n",
    },
    {
      path: "tsconfig.json",
      content: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            outDir: "dist",
            rootDir: "src",
            declaration: true,
            declarationMap: true,
            sourceMap: true,
            strict: true,
            skipLibCheck: true,
          },
          include: ["src/**/*"],
        },
        null,
        2,
      ) + "\n",
    },
    {
      path: "biome.json",
      content: JSON.stringify(
        {
          $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
          formatter: {
            enabled: true,
            indentStyle: "space",
            indentWidth: 2,
          },
          linter: {
            enabled: true,
            rules: {
              recommended: true,
            },
          },
        },
        null,
        2,
      ) + "\n",
    },
    {
      path: "README.md",
      content: `# ${config.name}

TypeScript library.

Generated with [genrex](https://github.com/waeterr/genrex).

## Installation

\`\`\`bash
${config.packageManager} add ${config.name}
\`\`\`

## Usage

\`\`\`typescript
import { greet } from "${config.name}";

console.log(greet("world"));
\`\`\`

## Scripts

- \`${config.packageManager} run build\` — Build TypeScript to dist/
- \`${config.packageManager} test\` — Run tests with Vitest
- \`${config.packageManager} run lint\` — Lint with Biome
`,
    },
    {
      path: ".gitignore",
      content: `node_modules/
dist/
coverage/
*.log
`,
    },
    {
      path: ".npmignore",
      content: `src/
tests/
coverage/
*.test.ts
*.config.*
biome.json
tsconfig.json
`,
    },
    {
      path: "src/index.ts",
      content: `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`,
    },
    {
      path: "tests/index.test.ts",
      content: `import { expect, test } from "vitest";
import { greet } from "../src/index.js";

test("greet returns greeting", () => {
  expect(greet("world")).toBe("Hello, world!");
});
`,
    },
  ];

  if (config.githubActions) {
    files.push({
      path: ".github/workflows/ci.yml",
      content: generateCiWorkflow(config.packageManager),
    });
  }

  return files;
}

import type { ProjectConfig } from "../config.js";
import type { GeneratedFile } from "../generator.js";
import { generateCiWorkflow } from "../ci.js";
import { generateDockerfile, generateDockerignore } from "../docker.js";

export function buildNodeApiFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: config.name,
          version: "0.1.0",
          type: "module",
          scripts: {
            build: "tsc",
            dev: "tsx watch src/server.ts",
            start: "node dist/server.js",
            test: "vitest run",
            format: "biome format --write .",
            lint: "biome check .",
          },
          dependencies: {
            fastify: "^5.1.0",
          },
          devDependencies: {
            "@biomejs/biome": "^1.9.0",
            "@types/node": "^22.0.0",
            tsx: "^4.19.0",
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

Node.js REST API built with Fastify.

Generated with [genrex](https://github.com/waeterr/genrex).

## Scripts

- \`${config.packageManager} run dev\` — Start development server with watch
- \`${config.packageManager} run build\` — Build with TypeScript
- \`${config.packageManager} start\` — Run production server
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
      path: "src/server.ts",
      content: `import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

server.get("/", async () => {
  return { message: "Welcome to ${config.name}" };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
`,
    },
    {
      path: "tests/server.test.ts",
      content: `import { expect, test } from "vitest";

test("example test", () => {
  expect(1 + 1).toBe(2);
});

// ponytail: add integration tests with Fastify .inject()
`,
    },
  ];

  if (config.githubActions) {
    files.push({
      path: ".github/workflows/ci.yml",
      content: generateCiWorkflow(config.packageManager),
    });
  }

  if (config.docker) {
    files.push(
      {
        path: "Dockerfile",
        content: generateDockerfile(config),
      },
      {
        path: ".dockerignore",
        content: generateDockerignore(),
      },
    );
  }

  return files;
}

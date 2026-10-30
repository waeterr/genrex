import type { ProjectConfig } from "./config.js";

export function generateDockerfile(config: ProjectConfig): string {
  if (config.blueprint === "ts-cli") {
    return `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/src/index.js"]
`;
  }

  if (config.blueprint === "node-api") {
    return `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
`;
  }

  return `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "test"]
`;
}

export function generateDockerignore(): string {
  return `node_modules
dist
coverage
*.log
.git
.github
tests
*.test.ts
README.md
tsconfig.json
biome.json
`;
}

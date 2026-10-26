export type Capability =
  | "testing"
  | "formatting"
  | "git"
  | "github-actions"
  | "docker";

export interface Blueprint {
  id: string;
  name: string;
  version: string;
  description: string;
  language: string;
  capabilities: Capability[];
}

export const blueprints: Blueprint[] = [
  {
    id: "ts-cli",
    name: "TypeScript CLI",
    version: "1.0.0",
    description: "Production-ready TypeScript CLI tool.",
    language: "TypeScript",
    capabilities: ["testing", "formatting", "git", "github-actions", "docker"],
  },
  {
    id: "node-api",
    name: "Node.js API",
    version: "1.0.0",
    description: "Node.js REST API with routing and healthchecks.",
    language: "TypeScript",
    capabilities: ["testing", "formatting", "git", "github-actions", "docker"],
  },
  {
    id: "ts-lib",
    name: "TypeScript Library",
    version: "1.0.0",
    description: "Publishable TypeScript library blueprint.",
    language: "TypeScript",
    capabilities: ["testing", "formatting", "git", "github-actions"],
  },
];

export function getBlueprint(id: string): Blueprint | undefined {
  return blueprints.find((b) => b.id === id);
}

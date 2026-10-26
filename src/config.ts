export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface ProjectConfig {
  name: string;
  destination: string;
  blueprint: string;
  packageManager: PackageManager;
  testing: "vitest" | "none";
  formatter: "biome" | "none";
  git: boolean;
  githubActions: boolean;
  docker: boolean;
}

export function validateProjectName(name: string): string | null {
  if (!name || name.trim() === "") {
    return "Project name cannot be empty";
  }

  if (!/^[a-z0-9-_@/]+$/.test(name)) {
    return "Project name must contain only lowercase letters, numbers, hyphens, underscores, or scopes";
  }

  if (name.startsWith("-") || name.startsWith("_")) {
    return "Project name cannot start with - or _";
  }

  return null;
}

export function validateConfig(config: ProjectConfig): string[] {
  const errors: string[] = [];

  const nameError = validateProjectName(config.name);
  if (nameError) {
    errors.push(nameError);
  }

  if (!config.blueprint) {
    errors.push("Blueprint is required");
  }

  return errors;
}

import type { Cog } from '../types';

export function buildInstallSnippet(cog: Cog): string {
  const name = cog.name ?? cog.repo;
  const branch = cog.branch ? `#${cog.branch}` : '';
  const location = cog.install_url ?? `git+${cog.repo}.git${branch}`;
  return `[[ballsdex.packages]]\nlocation = "${location}"\npath = "${name}"\nenabled = true`;
}

export function buildCombinedInstallSnippet(cogs: Cog[]): string {
  return cogs.map(buildInstallSnippet).join('\n\n');
}

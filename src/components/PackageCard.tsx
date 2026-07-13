import { useState } from 'react';
import type { Cog } from '../types';
import { buildInstallSnippet } from '../lib/installSnippet';

function getLicenseText(license: Cog['license']): string {
  if (!license) return '';
  if (typeof license === 'string') return license;
  return license.text ?? '';
}

function getAuthorNames(authors: Cog['authors']): string[] {
  if (!authors) return [];
  return authors
    .map(a => (typeof a === 'string' ? a : a.name))
    .filter(Boolean) as string[];
}

// ── URL categorisation ───────────────────────────────────────────────────────

type UrlKind = 'wiki' | 'changelog' | 'funding';

const URL_MATCHERS: { kind: UrlKind; pattern: RegExp }[] = [
  { kind: 'wiki',      pattern: /wiki|doc|documentation|guide|manual/i },
  { kind: 'changelog', pattern: /patch.?note|changelog|change.?log|release|history/i },
  { kind: 'funding',   pattern: /fund|sponsor|donate|donation|patreon|ko.?fi|open.?collective/i },
];

function categoriseUrls(urls: Record<string, string>): Partial<Record<UrlKind, string>> {
  const result: Partial<Record<UrlKind, string>> = {};
  for (const [key, href] of Object.entries(urls)) {
    for (const { kind, pattern } of URL_MATCHERS) {
      if (!result[kind] && pattern.test(key)) {
        result[kind] = href;
      }
    }
  }
  return result;
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconLink({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="shrink-0 text-zinc-500 transition-colors hover:text-white group-hover:text-zinc-300"
    >
      {children}
    </a>
  );
}

function WikiIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ChangelogIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function FundingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function RepoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(stars % 1000 >= 100 ? 1 : 0)}k`;
  return String(stars);
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function PackageCard({
  cog,
  selected = false,
  onToggleSelect,
}: {
  cog: Cog;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const snippet = buildInstallSnippet(cog);
  const authors = getAuthorNames(cog.authors);
  const license = getLicenseText(cog.license);
  const extraUrls = categoriseUrls(cog.urls ?? {});

  function handleCopy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <article className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-[#1a1a1a] p-5 shadow-md transition-all duration-200 hover:border-zinc-600 hover:bg-[#1f1f1f] hover:shadow-xl ${selected ? 'border-sky-600' : 'border-zinc-800'}`}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              title="Add to install list"
              aria-label={`Select ${cog.name ?? cog.repo} for install`}
              className="mt-1 h-3.5 w-3.5 shrink-0 accent-sky-500"
            />
          )}
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">
              {cog.name ?? cog.repo}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {cog.version && (
                <span className="inline-block rounded-full border border-emerald-800/60 bg-emerald-950/60 px-2 font-mono text-xs text-emerald-400">
                  v{cog.version}
                </span>
              )}
              {typeof cog.stars === 'number' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-800/60 bg-amber-950/40 px-2 font-mono text-xs text-amber-400">
                  <StarIcon />
                  {formatStars(cog.stars)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Icon links */}
        <div className="mt-0.5 flex items-center gap-2">
          {extraUrls.wiki && (
            <IconLink href={extraUrls.wiki} title="Documentation / Wiki">
              <WikiIcon />
            </IconLink>
          )}
          {extraUrls.changelog && (
            <IconLink href={extraUrls.changelog} title="Patch notes / Changelog">
              <ChangelogIcon />
            </IconLink>
          )}
          {extraUrls.funding && (
            <IconLink href={extraUrls.funding} title="Support / Funding">
              <FundingIcon />
            </IconLink>
          )}
          {cog.repo && (
            <IconLink href={cog.repo} title="View repository">
              <RepoIcon />
            </IconLink>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed text-zinc-400">
        {cog.description ?? 'No description provided.'}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        {authors.length > 0 && <span>{authors.join(', ')}</span>}
        {license && (
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-zinc-400">
            {license}
          </span>
        )}
      </div>

      {/* Tags */}
      {cog.tags && cog.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {cog.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full border border-sky-800/60 bg-sky-950/40 px-2 py-0.5 text-xs text-sky-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Install */}
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Installation
        </button>

        {open && (
          <div className="relative mt-2">
            <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-[#0d0d0d] px-4 py-3 font-mono text-xs leading-relaxed text-zinc-300">
              {snippet}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

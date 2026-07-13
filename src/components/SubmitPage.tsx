export function SubmitPage() {
  const steps = [
    {
      n: 1,
      title: 'Fork the repository',
      body: (
        <>
          Fork{' '}
          <a
            href="https://github.com/Ballsdex-Team/ballsdex-index"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 underline underline-offset-2 hover:text-white"
          >
            Ballsdex-Team/ballsdex-index
          </a>{' '}
          on GitHub, then clone your fork locally.
        </>
      ),
    },
    {
      n: 2,
      title: 'Add your cog to data/cogs.json',
      body: (
        <>
          Open <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">data/cogs.json</code> and
          append an entry to the <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">unapproved</code> array:
          <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-[#0d0d0d] px-4 py-3 font-mono text-xs leading-relaxed text-zinc-300">{`{
  "repo": "https://github.com/you/your-repo",
  "branch": "main"
}`}</pre>
        </>
      ),
    },
    {
      n: 3,
      title: 'Ensure your repo has a valid pyproject.toml',
      body: (
        <>
          The root of your repository must contain a{' '}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">pyproject.toml</code> with
          the correct structure. See the{' '}
          <a
            href="https://wiki.ballsdex.com/dev/custom-package/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 underline underline-offset-2 hover:text-white"
          >
            Ballsdex wiki
          </a>{' '}
          for the required fields and format. Add an optional{' '}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">keywords</code> list to{' '}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">[project]</code> to power
          the tag filter on the index page, e.g. <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">keywords = ["economy", "fun"]</code>.
        </>
      ),
    },
    {
      n: 4,
      title: 'Open a pull request',
      body: (
        <>
          Push your change and open a PR against{' '}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">main</code>. A core team
          member will review and merge it after a quick glance. Once merged the
          index will update automatically within the hour.
        </>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-white">Submit a Package</h1>
      <p className="mb-10 text-sm text-zinc-400">
        Any Ballsdex cog can be listed here. Packages start as unapproved and
        are moved to approved after review by the core team.
      </p>

      <ol className="flex flex-col gap-6">
        {steps.map(step => (
          <li key={step.n} className="flex gap-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 font-mono text-xs font-semibold text-zinc-300">
              {step.n}
            </span>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-zinc-100">{step.title}</p>
              <div className="text-sm leading-relaxed text-zinc-400">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-xl border border-zinc-800 bg-[#1a1a1a] p-5 text-sm text-zinc-400">
        <p className="mb-1 font-semibold text-zinc-200">Useful links</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>
            <a
              href="https://github.com/Ballsdex-Team/ballsdex-index"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 underline underline-offset-2 hover:text-white"
            >
              github.com/Ballsdex-Team/ballsdex-index
            </a>
          </li>
          <li>
            <a
              href="https://wiki.ballsdex.com/dev/custom-package/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 underline underline-offset-2 hover:text-white"
            >
              wiki.ballsdex.com/dev/custom-package
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}

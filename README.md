# Ballsdex Package Index

A static frontend that lists community-submitted Ballsdex cogs (packages), with installation instructions generated from each package's `pyproject.toml`.

## How to submit a package

To submit a package, create a pull request that adds an entry to `data/cogs.json` with the following format:

```json
{
  "repo": "https://github.com/username/repo-name",
  "branch": "main"
}
```

Make sure to replace the `repo` and `branch` fields with the appropriate values for your package. The `repo` should be the URL of your GitHub repository, and the `branch` should be the branch where your package's code is located (usually "main" or "master"). The same repository (or the same package under a fork or a different branch) can be listed more than once — there's no unique identifier to coordinate.

If your repository hosts multiple packages (e.g. a monorepo with each package in its own folder), add an optional `subdirectory` field pointing to the folder containing that package's `pyproject.toml`, relative to the repo root:

```json
{
  "repo": "https://github.com/username/repo-name",
  "branch": "v3",
  "subdirectory": "packages/example-cog"
}
```

Everything else shown on the site — name, version, description, authors, tags, etc. — is read directly from your package's `pyproject.toml`. Tags come from the `[project]` table's `keywords` field:

```toml
[project]
name = "example-cog"
keywords = ["economy", "fun"]
```

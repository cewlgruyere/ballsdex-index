"""Shared helpers for cloning cog repos and checking for tagged releases."""

import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:
    # Python < 3.11
    try:
        import tomli as tomllib  # type: ignore
    except ModuleNotFoundError:
        print("ERROR: tomli is required on Python < 3.11. Install it with: pip install tomli", file=sys.stderr)
        sys.exit(1)

GITHUB_REPO_RE = re.compile(r"github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?/?$")


def cog_key(entry: dict) -> str:
    """Return a stable identifier for a cogs.json entry, derived from where it points.

    Used in place of a manually-assigned id so the same package can be listed
    more than once (e.g. under a different branch or fork) without collisions.
    """
    branch = entry.get("branch", "main")
    subdirectory = entry.get("subdirectory", "")
    return f"{entry['repo']}@{branch}#{subdirectory}"


def get_stars(repo_url: str) -> int | None:
    """Return the star count for a GitHub repo URL, or None if it can't be determined."""
    match = GITHUB_REPO_RE.search(repo_url)
    if not match:
        return None
    owner, name = match.groups()

    request = urllib.request.Request(f"https://api.github.com/repos/{owner}/{name}")
    request.add_header("Accept", "application/vnd.github+json")
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        request.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            data = json.load(response)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        print(f"  WARNING: Failed to fetch star count for {repo_url}: {e}", file=sys.stderr)
        return None

    return data.get("stargazers_count")


def get_release_ref(repo_url: str, version: str) -> str | None:
    """Return the tag name if a release tag exists for the given version, else None."""
    if not version:
        return None
    for tag in (f"v{version}", version):
        result = subprocess.run(
            ["git", "ls-remote", "--tags", repo_url, tag],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0 and result.stdout.strip():
            return tag
    return None


def clone_and_read(repo_url: str, branch: str, tmpdir: str, subdirectory: str | None = None) -> dict | None:
    """Clone repo_url@branch into tmpdir and return its pyproject.toml [project] table.

    If subdirectory is given, the pyproject.toml is read from that path within
    the repo instead of the repo root (for monorepos hosting multiple packages).
    """
    dest = os.path.join(tmpdir, "repo")
    result = subprocess.run(
        ["git", "clone", "--depth", "1", "--branch", branch, repo_url, dest],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"  WARNING: Failed to clone {repo_url}@{branch}: {result.stderr.strip()}", file=sys.stderr)
        return None

    package_dir = Path(dest) / subdirectory if subdirectory else Path(dest)
    pyproject_path = package_dir / "pyproject.toml"
    if not pyproject_path.exists():
        location = f"{repo_url} (subdirectory: {subdirectory})" if subdirectory else repo_url
        print(f"  WARNING: No pyproject.toml found in {location}", file=sys.stderr)
        return None

    with open(pyproject_path, "rb") as f:
        data = tomllib.load(f)

    project = data.get("project", {})
    return {
        "name": project.get("name", ""),
        "version": project.get("version", ""),
        "description": project.get("description", ""),
        "license": project.get("license", ""),
        "authors": project.get("authors", []),
        "urls": project.get("urls", {}),
        "dependencies": project.get("dependencies", []),
        "tags": project.get("keywords", []),
    }

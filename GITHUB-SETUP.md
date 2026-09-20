# Publish version 0.1.1 on GitHub

The release files are prepared for the repository `jeremyrobertdavison/heroic-character-creator`. They have not been published automatically.

1. Create a public GitHub repository named **heroic-character-creator** under **jeremyrobertdavison**.
2. Extract `heroic-character-creator.zip` locally. Open its inner `heroic-character-creator` folder.
3. In the repository, choose **Add file → Upload files**. Upload the contents of that inner folder: `module.json`, `README.md`, `package.json`, `scripts`, `styles`, `docs`, and `tests`. The repository root should contain `module.json`, not another enclosing folder. Commit the upload.
4. Open **Releases → Draft a new release**.
5. Create tag **v0.1.1** against the main branch. Title the release **Heroic Character Creator v0.1.1 — Prototype**.
6. Attach two release assets: the original **heroic-character-creator.zip** and the standalone **module.json**. GitHub's automatically generated Source code ZIP is not a substitute for the named ZIP asset in the manifest.
7. Publish the release as the latest release. For this package's `/latest/` manifest URL, do not mark it as a GitHub prerelease; describe its prototype status in the title and notes. Alternatively, if you prefer a GitHub prerelease, use the tag-specific manifest URL below for installation.
8. Check that both attached assets download successfully. The final asset URLs are:

```text
https://github.com/jeremyrobertdavison/heroic-character-creator/releases/download/v0.1.1/module.json
https://github.com/jeremyrobertdavison/heroic-character-creator/releases/download/v0.1.1/heroic-character-creator.zip
```

9. In Foundry Setup, choose **Add-on Modules → Install Module**. Paste this Manifest URL:

```text
https://github.com/jeremyrobertdavison/heroic-character-creator/releases/latest/download/module.json
```

10. Launch a supported world, open **Manage Modules**, enable **Heroic Character Creator**, and save.
11. Open the Actors directory and click **Create Character**. Existing character sheets have **Open Creator** in their window header. The settings menu and README macros are fallback entry points.

If you choose another repository name or owner, update `url`, `manifest`, and `download` in `module.json` before uploading. Make the same change in the ZIP's internal manifest and repackage it.

For future versions, increment `version` and the tagged `download` URL in both manifest copies, create the matching Git tag, and attach both files. Keep the stable `manifest` URL for Foundry updates. Do not mark a manifest as verified for a Foundry generation until it has been checked there; 0.1.1 targets generation 13 but still needs the live-world checklist.

Suggested release notes:

> Updated prototype with hard creation limits, a minimum of 10 Health/Focus, guided creation, ability allocation, basic power/trait budgets, 11 starter powers, origin/occupation grant examples, world Item and Item compendium loading, JSON imports, portable drafts, and GM editing with recovery copies. Full core-book content and rules validation are not yet included. Test in a separate world before campaign use.

If the repository already exists, upload the updated source, create a new **v0.1.1** release, and attach the new ZIP and manifest. Existing users can then use Foundry’s module update check. Keep the manifest asset named exactly `module.json`.

# Publishing and index

Verified 7 September 2026: repository `richmondjw/Optiflows`, production branch `main`, static files at repository root. `.github/workflows/static.yml` deploys pushes to GitHub Pages with no build step. CNAME currently contains `optiflows.com.au`; inspect current files instead of relying on older documentation that mentions www. Preserve the domain configuration and deployment workflow.

1. Inspect repository instructions, current branch, proposal directory and deployment workflow. Do not print credential files or alter unrelated site sections.
2. Prepare `proposals/<descriptive-slug>/index.html` and supporting relative assets. Add an All proposals link. Retain any applicable access controls; noindex does not make a URL private.
3. Update `proposals/index.html` with every existing proposal plus the new one. Preserve existing links. Use proposal title, client, date, short description and confirmed commercial summary; do not invent acceptance status. The index must not redirect to a single proposal.
4. Preserve the examples' `noindex,nofollow,noarchive,nosnippet,noimageindex` metadata. Keep proposal pages out of the marketing sitemap unless the user asks otherwise. An index makes linked proposals discoverable to visitors, even with noindex.
5. Review scope, links, responsive layout, print behaviour and signature logic. Never perform a production approval submission as a test.
6. Publish only when authorised. Use the existing Git/GitHub route. If shell credentials are unavailable, the connected GitHub API may create blobs, a tree and a commit, then fast-forward the branch. Build on the current tree, preserve unrelated files and use non-forced ref updates. If main advanced, reconcile changes instead of forcing.
7. Observe the deployment for the published commit. Verify the index and proposal URLs return the intended content, not only HTTP 200 (which may be a redirect or fallback). Check original proposal links still work. Report deployment success separately from browser/print/email-delivery checks.

Keep this skill in Git with the site source under `.agents/skills/optiflows-proposals`, and make it discoverable in the operator's skill directory when supported. Do not claim it is installed on James's other machines or agents merely because it was committed here.

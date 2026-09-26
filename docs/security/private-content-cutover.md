# OptiFlows private-content cutover

Status: implementation prepared, production cutover pending Cloudflare credentials and live policy verification.

## Boundary

GitHub Pages is public delivery. It must contain only intentionally public marketing output. Reports, proposals, prototypes, internal campaign material and other IP must not be copied into the Pages artifact. `noindex`, `robots.txt`, obscure URLs and browser JavaScript gates are defense in depth only; they are not authorization.

The protected origin is the `optiflows-private-content` Worker backed by the private R2 bucket `optiflows-private-content`. The Worker validates the Cloudflare Access JWT and checks the requested R2 object's `x-optiflows-allowed-emails` metadata. James's Access email is `james.richmondau@gmail.com`, configured as `PRIVATE_CONTENT_OWNER_EMAILS`; a valid Access assertion for that identity may read every existing private object without appearing in each object's metadata. Other recipients remain limited to their mapped objects. This avoids shared browser passwords.

## Cutover order

1. Create a Cloudflare Access application for `private.optiflows.com.au/*`, default deny, allowing `james.richmondau@gmail.com` and approved client email identities or groups. Verify James signs in with that exact identity. Record the team issuer and application audience in the Worker environment, never in source.
2. Create the R2 bucket and upload the approved private manifest. Set each object's content type and `x-optiflows-allowed-emails` metadata. Do not upload the entire public repository.
3. Deploy `workers/private-content.js` with `workers/wrangler.private-content.jsonc`; confirm `workers_dev` remains disabled.
4. Verify approved and unapproved recipient behaviour on the private hostname.
5. Only after the private origin passes, change the Pages workflow to upload the filtered output produced by `tools/stage-public-pages.mjs`.
6. Classify `mc.optiflows.com.au` and `em.optiflows.com.au`. Apply Access to protected hosts and baseline headers at their actual edge/origin; retain Emma's application authentication.
7. Purge cached private URLs and review GitHub history for exposed secrets or credentials. Rotate any secret that was ever embedded in browser-delivered code.

## Acceptance checks

- Anonymous `GET` and `HEAD` to every private object return an Access challenge or `401/403`, never report/proposal HTML.
- An approved recipient receives only their mapped object; a different approved identity receives `403`.
- James, signed in as `james.richmondau@gmail.com`, receives every existing private object, including one with no recipient list; another identity does not inherit that access.
- No public `workers.dev` endpoint exists and the R2 bucket is not publicly readable.
- Direct Pages/GitHub-origin URLs do not contain private object HTML after the filtered deployment.
- Public marketing remains reachable and its links do not depend on private paths.
- `mc` and `em` have an explicit classification, retained app auth where applicable, and verified `CSP`, `HSTS` (where appropriate), frame, MIME, referrer and permissions headers.
- Source and browser assets contain no reusable passwords, tokens or client-side authorization decisions.

# Ayrshare setup for Optiflows

## What was added
- `tools/social-assets/lib/ayrshare-client.js` - lightweight Ayrshare API client
- `tools/social-assets/ayrshare-post.js` - converts a rendered asset manifest or direct payload into an Ayrshare `/post` request
- `tools/social-assets/publish-to-pages.js` - copies rendered assets into the GitHub Pages-served `social-assets/` folder
- `tools/social-assets/publish-and-post.js` - end-to-end publish then Ayrshare post runner
- `.env.example` - required Ayrshare environment variables
- npm scripts in `package.json`

## Required config
Copy `.env.example` into a real env file used by Optiflows and fill in:

```env
AYRSHARE_API_KEY=your_primary_api_key
AYRSHARE_PROFILE_KEY=optional_business_plan_profile_key
AYRSHARE_BASE_URL=https://api.ayrshare.com/api
AYRSHARE_DEFAULT_PLATFORMS=linkedin,facebook,instagram
AYRSHARE_DEFAULT_POST_TEXT=
OPTIFLOWS_SITE_BASE_URL=https://www.optiflows.com.au
OPTIFLOWS_PUBLIC_MEDIA_BASE_URL=
```

## Final-mile hosting path
Optiflows already deploys the repo root to GitHub Pages.
That means anything under `social-assets/` becomes public at:

```text
https://www.optiflows.com.au/social-assets/...
```

The new publisher copies rendered outputs from `tools/social-assets/output/...` into that public folder so Ayrshare can use them.

## Workflow
1. Render assets:
   ```bash
   npm run assets:test
   ```
2. Publish assets into the Pages-served folder:
   ```bash
   npm run assets:publish
   ```
3. Commit and push so GitHub Pages deploys the new public asset URLs:
   ```bash
   git add social-assets
   git commit -m "Publish Optiflows social assets"
   git push origin main
   ```
4. Preview the outgoing Ayrshare payload:
   ```bash
   npm run social:publish:dry-run
   ```
5. Send the post:
   ```bash
   npm run social:publish
   ```

## Important operational note
GitHub Pages must finish deploying before Ayrshare can fetch the images.
So the safe sequence is:
- render
- publish files into `social-assets/`
- push to `main`
- wait for Pages deploy to complete
- then run the Ayrshare post command

## Generated public URL shape
If a render output file is:

```text
optiflows-operating-system-carousel-slide-01.png
```

and the target folder is:

```text
social-assets/optiflows-operating-system-carousel
```

then the public URL becomes:

```text
https://www.optiflows.com.au/social-assets/optiflows-operating-system-carousel/optiflows-operating-system-carousel-slide-01.png
```

## Scripts
- `npm run assets:test` - render sample assets
- `npm run assets:publish` - copy latest rendered outputs into `social-assets/...`
- `npm run ayrshare:dry-run` - preview raw Ayrshare payload using current env
- `npm run ayrshare:post` - send current manifest to Ayrshare
- `npm run social:publish:dry-run` - publish locally and preview final Ayrshare payload
- `npm run social:publish` - publish locally and send to Ayrshare

## Direct payload mode
You can also bypass the manifest and pass a hand-written Ayrshare payload JSON shaped like:

```json
{
  "post": "Today is a great day!",
  "platforms": ["linkedin", "facebook"],
  "mediaUrls": [
    "https://www.optiflows.com.au/social-assets/example/example-01.png",
    "https://www.optiflows.com.au/social-assets/example/example-02.png"
  ],
  "scheduleDate": "2026-04-15T09:00:00Z"
}
```

Then run:

```bash
node tools/social-assets/ayrshare-post.js --input path/to/payload.json --dry-run
node tools/social-assets/ayrshare-post.js --input path/to/payload.json
```

## Maven handoff details
Give Maven this config block:

```json
{
  "ayrshare": {
    "baseUrl": "https://api.ayrshare.com/api",
    "auth": {
      "type": "bearer",
      "env": "AYRSHARE_API_KEY"
    },
    "optionalHeaders": {
      "Profile-Key": "AYRSHARE_PROFILE_KEY"
    },
    "defaultPostEndpoint": "/post",
    "defaultPlatformsEnv": "AYRSHARE_DEFAULT_PLATFORMS",
    "siteBaseUrlEnv": "OPTIFLOWS_SITE_BASE_URL",
    "publicMediaBaseUrlEnv": "OPTIFLOWS_PUBLIC_MEDIA_BASE_URL",
    "publishScript": "npm run assets:publish",
    "endToEndScript": "npm run social:publish"
  }
}
```

And these operational notes:
- Header format: `Authorization: Bearer <AYRSHARE_API_KEY>`
- Business plan profile posting: also send `Profile-Key: <AYRSHARE_PROFILE_KEY>`
- Content type: `application/json`
- Base URL: `https://api.ayrshare.com/api`
- Main first endpoint: `POST /post`
- Public media root for this repo: `https://www.optiflows.com.au/social-assets/`
- Media must be publicly accessible URLs, not local file paths
- If newly published assets are being used, wait for GitHub Pages deployment before calling Ayrshare

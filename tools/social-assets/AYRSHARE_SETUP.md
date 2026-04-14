# Ayrshare setup for Optiflows

## What was added
- `tools/social-assets/lib/ayrshare-client.js` - lightweight Ayrshare API client
- `tools/social-assets/ayrshare-post.js` - converts a rendered asset manifest or direct payload into an Ayrshare `/post` request
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
OPTIFLOWS_PUBLIC_MEDIA_BASE_URL=https://your-public-host/social-assets/optiflows-carousel
```

## Important limitation
Ayrshare expects public media URLs for images and videos.
That means rendered Optiflows assets must be hosted somewhere reachable over HTTPS before posting.

Right now the script maps local rendered files to URLs using `OPTIFLOWS_PUBLIC_MEDIA_BASE_URL` plus the file name.
So if your manifest contains `optiflows-operating-system-carousel-slide-01.png`, the final URL becomes:

```text
https://your-public-host/social-assets/optiflows-carousel/optiflows-operating-system-carousel-slide-01.png
```

## Workflow
1. Render assets:
   ```bash
   npm run assets:test
   ```
2. Upload the output PNG files to your public media location.
3. Set `OPTIFLOWS_PUBLIC_MEDIA_BASE_URL` to that public folder.
4. Preview the outgoing Ayrshare payload:
   ```bash
   npm run ayrshare:dry-run
   ```
5. Send the post:
   ```bash
   npm run ayrshare:post
   ```

## Direct payload mode
You can also bypass the manifest and pass a hand-written Ayrshare payload JSON shaped like:

```json
{
  "post": "Today is a great day!",
  "platforms": ["linkedin", "facebook"],
  "mediaUrls": [
    "https://your-public-host/example-01.png",
    "https://your-public-host/example-02.png"
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
    "publicMediaBaseUrlEnv": "OPTIFLOWS_PUBLIC_MEDIA_BASE_URL"
  }
}
```

And these operational notes:
- Header format: `Authorization: Bearer <AYRSHARE_API_KEY>`
- Business plan profile posting: also send `Profile-Key: <AYRSHARE_PROFILE_KEY>`
- Content type: `application/json`
- Base URL: `https://api.ayrshare.com/api`
- Main first endpoint: `POST /post`
- Rendered media must be publicly accessible URLs, not local file paths

## Suggested next step
If you want full automation, I’d add one more piece next: an upload step to S3, Cloudflare R2, Supabase Storage, or similar, so render -> upload -> Ayrshare post becomes one command.

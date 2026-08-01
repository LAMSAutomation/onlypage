<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/884d39d8-c8e7-49a2-acfe-cb9e7edc5a74

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Prime Strikes demo account

The repository includes a reusable five-page Prime Strikes site kit and an
idempotent Supabase seed script. It creates a confirmed test user, publishes
the demo site, seeds all five pages, and adds three course products.

Set a valid `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, then run:

```powershell
$env:PRIME_STRIKES_EMAIL='prime.strikes.demo@example.com'
$env:PRIME_STRIKES_PASSWORD='use-a-unique-12-plus-character-password'
npx tsx scripts\seed-prime-strikes.ts
```

The service-role key is required only for the one-time confirmed-user seed and
must never use a `VITE_` prefix or be exposed in browser code.

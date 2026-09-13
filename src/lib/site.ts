// The site's absolute origin, resolved once for every URL-based consumer (metadataBase now;
// JSON-LD, sitemap and robots in Phase 3). Order: the production domain set on Vercel as
// NEXT_PUBLIC_SITE_URL → Vercel's production URL → local development.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();

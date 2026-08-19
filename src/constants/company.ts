/**
 * Real business details go here — this is the one file to edit once they're
 * available. Every canonical URL, JSON-LD block, and contact CTA in the app
 * reads from this file, never a hardcoded literal (docs/plan §6 SEO strategy).
 */
export const COMPANY = {
  name: "Delvion Energy",
  legalName: "Delvion Energy",
  siteUrl: "https://www.delvionenergy.in",
  phone: "+918015296788",
  phoneDisplay: "+91 80152 96788",
  whatsapp: "918015296788",
  email: "Delvionenergy@gmail.com",
  gstin: "33KMAPK9720H1ZY",
  address: {
    // Street address and postal code aren't available yet — add them here
    // once known; structuredData.ts already omits them from JSON-LD until then.
    addressLocality: "Tiruchirappalli",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  // No social profiles yet — add real URLs here when available (nothing
  // renders them until then; buildOrganizationJsonLd's `sameAs` is empty).
  social: {},
} as const;

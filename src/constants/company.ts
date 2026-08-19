/**
 * Real business details go here — this is the one file to edit once they're
 * available. Every canonical URL, JSON-LD block, and contact CTA in the app
 * reads from this file, never a hardcoded literal (docs/plan §6 SEO strategy).
 */
export const COMPANY = {
  name: "Delvion Energy",
  legalName: "Delvion Energy",
  siteUrl: "https://www.delvionenergy.in",
  // TODO: real phone number (E.164 for tel: links, e.g. "+91XXXXXXXXXX").
  phone: "+91TODO",
  phoneDisplay: "TODO",
  // TODO: WhatsApp number, digits only, no "+" (used in wa.me links).
  whatsapp: "91TODO",
  email: "Delvionenergy@gmail.com",
  gstin: "33KMAPK9720H1ZY",
  address: {
    // TODO: real office address.
    streetAddress: "TODO",
    addressLocality: "Tiruchirappalli",
    addressRegion: "Tamil Nadu",
    postalCode: "TODO",
    addressCountry: "IN",
  },
  social: {
    // TODO: real social profile URLs, or remove unused entries.
    instagram: "",
    linkedin: "",
    youtube: "",
  },
} as const;

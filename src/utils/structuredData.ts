import { COMPANY } from "~/constants/company";
import { canonicalFor } from "~/constants/seo";

/** schema.org JSON-LD is inherently a loosely-typed, per-@type shape — a
 * plain object map is the honest type, not `any`. */
export type JsonLdObject = Record<string, unknown>;

export function buildOrganizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: COMPANY.siteUrl,
    description: COMPANY.description,
    // Both business lines, explicitly. Without these the only machine-readable
    // statements about the company were the three solar Service entries, so
    // the automation side was invisible to anything that reads the schema
    // rather than the page.
    knowsAbout: [
      "Rooftop Solar Installation",
      "Solar EPC",
      "Industrial Automation",
      "Special Purpose Machines",
      "Conveyors and Material Handling Systems",
      "Robotic Automation",
      "Gantry Automation",
    ],
    email: COMPANY.email,
    telephone: COMPANY.phone,
    // streetAddress/postalCode omitted until real values are available —
    // schema.org's PostalAddress doesn't require them.
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY.address.addressLocality,
      addressRegion: COMPANY.address.addressRegion,
      addressCountry: COMPANY.address.addressCountry,
    },
    sameAs: Object.values(COMPANY.social).filter(
      (url): url is string => typeof url === "string" && url.length > 0,
    ),
  };
}

export function buildWebsiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.name,
    url: COMPANY.siteUrl,
  };
}

export function buildLocalBusinessJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    url: COMPANY.siteUrl,
    description: COMPANY.description,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    taxID: COMPANY.gstin,
    // streetAddress/postalCode omitted until real values are available —
    // schema.org's PostalAddress doesn't require them.
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY.address.addressLocality,
      addressRegion: COMPANY.address.addressRegion,
      addressCountry: COMPANY.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      contactType: "customer service",
      email: COMPANY.email,
    },
  };
}

export function buildServiceJsonLd(options: {
  name: string;
  description: string;
  path: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: options.name,
    name: options.name,
    description: options.description,
    url: canonicalFor(options.path),
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.siteUrl,
    },
  };
}

export function buildFaqPageJsonLd(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalFor(item.path),
    })),
  };
}

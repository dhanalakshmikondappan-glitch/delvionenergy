import type { JsonLdObject } from "~/utils/structuredData";

interface JsonLdProps {
  data: JsonLdObject | JsonLdObject[];
}

/**
 * Renders one or more schema.org blocks as <script type="application/ld+json">.
 * The "</" escape prevents a string value from prematurely closing the
 * script tag and injecting markup into the page.
 */
export function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}

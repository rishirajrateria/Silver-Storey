import React from 'react';

type JsonLdProps = {
  /** One schema object or an array of them (rendered as a single @graph-less array). */
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
};

/**
 * Renders schema.org JSON-LD. `<` is escaped so user-supplied strings can
 * never break out of the script tag.
 */
export default function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

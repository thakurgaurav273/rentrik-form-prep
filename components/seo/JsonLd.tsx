interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

// React 19 renders <script> children as raw text (no escaping), so JSON-LD
// can be passed as children instead of dangerouslySetInnerHTML.
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </>
  );
}

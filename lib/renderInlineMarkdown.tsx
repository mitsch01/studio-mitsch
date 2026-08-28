import { Fragment, type ReactNode } from "react";

// Minimal inline-markdown support for GitHub repo descriptions: turns
// "**bold**" into real <strong> tags. Deliberately not a full markdown
// parser/library — repo descriptions are a single line and only ever use
// bold emphasis.
export function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

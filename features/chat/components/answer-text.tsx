"use client";

import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface AnswerTextProps {
  /** The answer body, as the backend sent it. */
  children: string;
}

/**
 * AnswerText — renders an answer body as Markdown.
 *
 * Answers used to be rendered as a text node, which meant any formatting in
 * them showed up as literal characters: `**30 working days**` appeared with the
 * asterisks, and a list arrived as one run-on paragraph. Composed answers carry
 * that formatting by default, so the syntax was reaching the reader.
 *
 * SECURITY: raw HTML in the answer is NOT rendered. `react-markdown` escapes it
 * unless `rehype-raw` is added, and it must not be — an answer body is content
 * from a model and a document store, not trusted markup, and this product's
 * claim rests on what is on screen being traceable to an approved source.
 * `react-markdown` also sanitises URL protocols, so a `javascript:` link in an
 * answer is dropped rather than made clickable.
 *
 * `remark-breaks` is deliberate. Without it a single newline is Markdown
 * whitespace and consecutive lines are joined into one paragraph — which is
 * wrong for a backend that sends plain prose with hard line breaks, the
 * behaviour that held before this component existed. With it, both a Markdown
 * answer and a plain-text one render the way they were written.
 */
export function AnswerText({ children }: AnswerTextProps) {
  return (
    <div className="text-[16px] leading-relaxed text-black dark:text-white">
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Spacing is set per element rather than through a prose class: the
          // answer sits in a `space-y-4` stack next to its source cards, and a
          // typography preset would fight that rhythm.
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 ps-5 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 ps-5 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          // Headings are rendered small. An answer is a passage inside a
          // conversation, not a document, so a heading that outsizes the
          // question above it reads as the wrong hierarchy.
          h1: ({ children }) => <p className="mt-4 mb-2 font-semibold first:mt-0">{children}</p>,
          h2: ({ children }) => <p className="mt-4 mb-2 font-semibold first:mt-0">{children}</p>,
          h3: ({ children }) => <p className="mt-4 mb-2 font-semibold first:mt-0">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-s-2 border-neutral-300 ps-3 text-neutral-700 last:mb-0 dark:border-neutral-600 dark:text-neutral-300">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[14px] dark:bg-neutral-800">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-lg bg-neutral-100 p-3 text-[14px] last:mb-0 dark:bg-neutral-800">
              {children}
            </pre>
          ),
          // Opened in a new tab so a click does not discard the conversation.
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              {children}
            </a>
          ),
          // Tables scroll inside their own container rather than widening the
          // thread, which would push the composer off screen on a phone.
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto last:mb-0">
              <table className="w-full border-collapse text-[14px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-neutral-200 px-2 py-1 text-start font-semibold dark:border-neutral-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-neutral-200 px-2 py-1 dark:border-neutral-700">
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-neutral-200 dark:border-neutral-700" />,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

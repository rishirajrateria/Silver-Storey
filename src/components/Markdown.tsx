import React from 'react';
import Link from 'next/link';
import { parseMarkdown, type Block, type InlineNode } from '@/lib/markdown';

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.type) {
          case 'text':
            return <React.Fragment key={i}>{node.value}</React.Fragment>;
          case 'strong':
            return (
              <strong key={i} className="font-semibold text-black">
                <Inline nodes={node.children} />
              </strong>
            );
          case 'em':
            return (
              <em key={i} className="italic">
                <Inline nodes={node.children} />
              </em>
            );
          case 'code':
            return (
              <code
                key={i}
                className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em]"
              >
                {node.value}
              </code>
            );
          case 'image':
            return (
              <img
                key={i}
                src={node.src}
                alt={node.alt}
                loading="lazy"
                decoding="async"
                className="inline-block max-w-full rounded"
              />
            );
          case 'link': {
            const external = /^https?:\/\//i.test(node.href);
            if (external) {
              return (
                <a
                  key={i}
                  href={node.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-black"
                >
                  <Inline nodes={node.children} />
                </a>
              );
            }
            return (
              <Link
                key={i}
                href={node.href}
                className="underline underline-offset-2 hover:text-black"
              >
                <Inline nodes={node.children} />
              </Link>
            );
          }
        }
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading': {
      const cls =
        block.level === 2
          ? 'mt-10 mb-4 scroll-mt-24 text-2xl font-bold text-black'
          : block.level === 3
            ? 'mt-8 mb-3 scroll-mt-24 text-xl font-bold text-black'
            : 'mt-6 mb-2 scroll-mt-24 text-lg font-bold text-black';
      const Tag = `h${block.level}` as unknown as 'h2';
      return (
        <Tag id={block.id} className={cls}>
          <Inline nodes={block.children} />
        </Tag>
      );
    }
    case 'paragraph':
      return (
        <p className="mb-5 text-base leading-relaxed text-black/75">
          <Inline nodes={block.children} />
        </p>
      );
    case 'list':
      return block.ordered ? (
        <ol className="mb-5 list-decimal pl-6 text-base leading-relaxed text-black/75">
          {block.items.map((item, i) => (
            <li key={i} className="mb-1.5">
              <Inline nodes={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mb-5 list-disc pl-6 text-base leading-relaxed text-black/75">
          {block.items.map((item, i) => (
            <li key={i} className="mb-1.5">
              <Inline nodes={item} />
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="my-6 border-l-4 border-[#6b1a1a] py-1 pl-5 text-black/70 italic">
          <Inline nodes={block.children} />
        </blockquote>
      );
    case 'code':
      return (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-black p-4 text-sm text-white">
          <code>{block.value}</code>
        </pre>
      );
    case 'table':
      return (
        <div className="glass-panel mb-6 overflow-x-auto rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-2.5 font-semibold">
                    <Inline nodes={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-black/75">
                      <Inline nodes={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'image':
      return (
        <figure className="my-8">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="w-full rounded-xl object-cover"
          />
          {block.alt && (
            <figcaption className="mt-2 text-center text-xs text-black/40">
              {block.alt}
            </figcaption>
          )}
        </figure>
      );
    case 'hr':
      return <hr className="my-10 border-black/10" />;
  }
}

/** Renders Markdown as React elements. Source HTML is never injected. */
export default function Markdown({ source }: { source: string }) {
  const blocks = React.useMemo(() => parseMarkdown(source), [source]);
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </>
  );
}

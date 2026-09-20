/**
 * A small, dependency-free Markdown parser for CMS blog bodies.
 *
 * It produces a block tree that `<Markdown>` renders as React elements — raw
 * HTML in the source is never injected, so editor input cannot inject scripts.
 *
 * Supported: ATX headings (##, ###, ####), paragraphs, unordered and ordered
 * lists, blockquotes, fenced code blocks, pipe tables, horizontal rules,
 * images, and inline bold / italic / code / links.
 */

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: InlineNode[] }
  | { type: 'image'; src: string; alt: string };

export type Block =
  | {
      type: 'heading';
      level: 2 | 3 | 4;
      text: string;
      id: string;
      children: InlineNode[];
    }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'code'; value: string; lang?: string }
  | { type: 'table'; headers: InlineNode[][]; rows: InlineNode[][][] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'hr' };

/** Stable, URL-safe heading id used for anchors and the table of contents. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ───────────────────────────── Inline parsing ───────────────────────────── */

const INLINE_PATTERN =
  /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*(?!\s)[^*]+\*|`[^`]+`)/;

export function parseInline(input: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let rest = input;

  while (rest.length > 0) {
    const match = INLINE_PATTERN.exec(rest);
    if (!match || match.index === undefined) {
      nodes.push({ type: 'text', value: rest });
      break;
    }

    if (match.index > 0) {
      nodes.push({ type: 'text', value: rest.slice(0, match.index) });
    }

    const token = match[0];

    if (token.startsWith('![')) {
      const m = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(token);
      if (m) nodes.push({ type: 'image', alt: m[1], src: m[2].trim() });
    } else if (token.startsWith('[')) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (m)
        nodes.push({
          type: 'link',
          href: m[2].trim(),
          children: parseInline(m[1]),
        });
    } else if (token.startsWith('**') || token.startsWith('__')) {
      nodes.push({ type: 'strong', children: parseInline(token.slice(2, -2)) });
    } else if (token.startsWith('*')) {
      nodes.push({ type: 'em', children: parseInline(token.slice(1, -1)) });
    } else if (token.startsWith('`')) {
      nodes.push({ type: 'code', value: token.slice(1, -1) });
    }

    rest = rest.slice(match.index + token.length);
  }

  return nodes.filter((n) => !(n.type === 'text' && n.value === ''));
}

/* ───────────────────────────── Block parsing ───────────────────────────── */

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());
}

const isTableDivider = (line: string) =>
  /^\s*\|?[\s:-]*-[-\s|:]*\|?\s*$/.test(line) && line.includes('-');

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Fenced code
    if (line.trimStart().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || undefined;
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        body.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: 'code', value: body.join('\n'), lang });
      continue;
    }

    // Horizontal rule
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading
    const heading = /^(#{2,4})\s+(.*)$/.exec(line.trim());
    if (heading) {
      const text = heading[2].trim();
      blocks.push({
        type: 'heading',
        level: heading[1].length as 2 | 3 | 4,
        text,
        id: slugifyHeading(text),
        children: parseInline(text),
      });
      i++;
      continue;
    }

    // Table: header row followed by a divider row
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      isTableDivider(lines[i + 1])
    ) {
      const headers = splitTableRow(line).map(parseInline);
      i += 2;
      const rows: InlineNode[][][] = [];
      while (
        i < lines.length &&
        lines[i].includes('|') &&
        lines[i].trim() !== ''
      ) {
        rows.push(splitTableRow(lines[i]).map(parseInline));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Blockquote
    if (/^\s*>\s?/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'quote',
        children: parseInline(body.join(' ').trim()),
      });
      continue;
    }

    // Lists
    const unordered = /^\s*[-*+]\s+(.*)$/;
    const ordered = /^\s*\d+[.)]\s+(.*)$/;
    if (unordered.test(line) || ordered.test(line)) {
      const isOrdered = ordered.test(line);
      const pattern = isOrdered ? ordered : unordered;
      const items: InlineNode[][] = [];
      while (i < lines.length && pattern.test(lines[i])) {
        const m = pattern.exec(lines[i])!;
        items.push(parseInline(m[1].trim()));
        i++;
      }
      blocks.push({ type: 'list', ordered: isOrdered, items });
      continue;
    }

    // Standalone image
    const standaloneImage = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (standaloneImage) {
      blocks.push({
        type: 'image',
        alt: standaloneImage[1],
        src: standaloneImage[2].trim(),
      });
      i++;
      continue;
    }

    // Paragraph — consume until a blank line or the start of another block
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{2,4})\s+/.test(lines[i].trim()) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !unordered.test(lines[i]) &&
      !ordered.test(lines[i]) &&
      !lines[i].trimStart().startsWith('```')
    ) {
      paragraph.push(lines[i].trim());
      i++;
    }
    if (paragraph.length) {
      blocks.push({
        type: 'paragraph',
        children: parseInline(paragraph.join(' ')),
      });
    }
  }

  return blocks;
}

/* ─────────────────────────────── Helpers ─────────────────────────────── */

function inlineText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case 'text':
          return n.value;
        case 'code':
          return n.value;
        case 'image':
          return n.alt;
        default:
          return inlineText(n.children);
      }
    })
    .join('');
}

/** Plain text of a document — used for meta descriptions and word counts. */
export function markdownToPlainText(source: string): string {
  return parseMarkdown(source)
    .map((b) => {
      switch (b.type) {
        case 'heading':
          return b.text;
        case 'paragraph':
        case 'quote':
          return inlineText(b.children);
        case 'list':
          return b.items.map(inlineText).join(' ');
        case 'table':
          return [...b.headers, ...b.rows.flat()].map(inlineText).join(' ');
        case 'code':
          return b.value;
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function markdownWordCount(source: string): number {
  return markdownToPlainText(source).split(/\s+/).filter(Boolean).length;
}

export function markdownReadMinutes(source: string): number {
  return Math.max(1, Math.round(markdownWordCount(source) / 200));
}

/** Level-2 headings, for an article table of contents. */
export function markdownHeadings(
  source: string,
): { id: string; text: string }[] {
  return parseMarkdown(source)
    .filter(
      (b): b is Extract<Block, { type: 'heading' }> =>
        b.type === 'heading' && b.level === 2,
    )
    .map((b) => ({ id: b.id, text: b.text }));
}

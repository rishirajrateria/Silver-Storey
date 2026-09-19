import { describe, it, expect } from 'vitest';
import {
  parseMarkdown,
  parseInline,
  markdownToPlainText,
  markdownHeadings,
  markdownReadMinutes,
  slugifyHeading,
} from '@/lib/markdown';

describe('inline parsing', () => {
  it('parses bold, italic and code', () => {
    expect(parseInline('a **b** c *d* e `f`')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'strong', children: [{ type: 'text', value: 'b' }] },
      { type: 'text', value: ' c ' },
      { type: 'em', children: [{ type: 'text', value: 'd' }] },
      { type: 'text', value: ' e ' },
      { type: 'code', value: 'f' },
    ]);
  });

  it('parses links and images', () => {
    expect(parseInline('[text](/a)')).toEqual([
      { type: 'link', href: '/a', children: [{ type: 'text', value: 'text' }] },
    ]);
    expect(parseInline('![alt](/i.jpg)')).toEqual([
      { type: 'image', alt: 'alt', src: '/i.jpg' },
    ]);
  });

  it('treats HTML in source as literal text, never as markup', () => {
    const nodes = parseInline('<script>alert(1)</script>');
    expect(nodes).toEqual([
      { type: 'text', value: '<script>alert(1)</script>' },
    ]);
  });
});

describe('block parsing', () => {
  it('parses headings with stable ids', () => {
    const [h] = parseMarkdown('## Cost in India (2026)');
    expect(h).toMatchObject({
      type: 'heading',
      level: 2,
      id: 'cost-in-india-2026',
    });
  });

  it('parses unordered and ordered lists', () => {
    const blocks = parseMarkdown('- one\n- two\n\n1. first\n2. second');
    expect(blocks[0]).toMatchObject({ type: 'list', ordered: false });
    expect(blocks[1]).toMatchObject({ type: 'list', ordered: true });
    expect((blocks[0] as { items: unknown[] }).items).toHaveLength(2);
  });

  it('parses tables with headers and rows', () => {
    const md = '| A | B |\n| --- | --- |\n| 1 | 2 |\n| 3 | 4 |';
    const [table] = parseMarkdown(md);
    expect(table).toMatchObject({ type: 'table' });
    const t = table as { headers: unknown[]; rows: unknown[][] };
    expect(t.headers).toHaveLength(2);
    expect(t.rows).toHaveLength(2);
  });

  it('parses blockquotes, code fences and rules', () => {
    const blocks = parseMarkdown('> quoted\n\n```ts\nconst a = 1;\n```\n\n---');
    expect(blocks.map((b) => b.type)).toEqual(['quote', 'code', 'hr']);
    expect(blocks[1]).toMatchObject({ lang: 'ts', value: 'const a = 1;' });
  });

  it('joins wrapped lines into a single paragraph', () => {
    const blocks = parseMarkdown('line one\nline two\n\nsecond para');
    expect(blocks).toHaveLength(2);
    expect(markdownToPlainText('line one\nline two')).toBe('line one line two');
  });

  it('does not treat a lone hyphen inside a word as a list', () => {
    const blocks = parseMarkdown('state-of-the-art design');
    expect(blocks[0].type).toBe('paragraph');
  });
});

describe('derived helpers', () => {
  const doc = '## First\n\nSome words here.\n\n## Second\n\nMore words.';

  it('extracts level-2 headings for a table of contents', () => {
    expect(markdownHeadings(doc)).toEqual([
      { id: 'first', text: 'First' },
      { id: 'second', text: 'Second' },
    ]);
  });

  it('computes plain text and a minimum read time of one minute', () => {
    expect(markdownToPlainText(doc)).toBe(
      'First Some words here. Second More words.',
    );
    expect(markdownReadMinutes(doc)).toBe(1);
  });

  it('slugifies headings safely', () => {
    expect(slugifyHeading('  Plywood vs. HDHMR & MDF!  ')).toBe(
      'plywood-vs-hdhmr-mdf',
    );
  });

  it('handles an empty document', () => {
    expect(parseMarkdown('')).toEqual([]);
    expect(markdownToPlainText('')).toBe('');
  });
});

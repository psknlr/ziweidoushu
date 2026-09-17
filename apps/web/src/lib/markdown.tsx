/**
 * 轻量 Markdown → React 渲染器(无 HTML 注入面:只生成 React 元素,不用 innerHTML)。
 * 支持:标题、段落、有序/无序列表、表格、引用、分隔线、围栏代码、行内 代码/粗体/斜体/删除线/链接。
 * 面向流式输出:未闭合的表格/代码块按当前已有内容渲染,不抛错。
 */
import type { ReactNode } from 'react';

type Block =
  | { t: 'h'; level: number; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[]; start: number }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'quote'; text: string }
  | { t: 'hr' }
  | { t: 'code'; lang: string; text: string };

const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isSepRow = (l: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.includes('-');
const splitRow = (l: string) => {
  const s = l.trim().replace(/^\|/, '').replace(/\|$/, '');
  return s.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
};

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  const para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push({ t: 'p', text: para.join('\n') });
      para.length = 0;
    }
  };
  while (i < lines.length) {
    const line = lines[i]!;
    const fence = line.match(/^\s*```(\w*)/);
    if (fence) {
      flushPara();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i]!)) buf.push(lines[i++]!);
      i++;
      blocks.push({ t: 'code', lang: fence[1] ?? '', text: buf.join('\n') });
      continue;
    }
    if (/^\s*$/.test(line)) { flushPara(); i++; continue; }
    const h = line.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) { flushPara(); blocks.push({ t: 'h', level: h[1]!.length, text: h[2]! }); i++; continue; }
    if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) { flushPara(); blocks.push({ t: 'hr' }); i++; continue; }
    if (isTableRow(line) && i + 1 < lines.length && isSepRow(lines[i + 1]!)) {
      flushPara();
      const head = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && isTableRow(lines[i]!)) rows.push(splitRow(lines[i++]!));
      blocks.push({ t: 'table', head, rows });
      continue;
    }
    if (/^\s*>/.test(line)) {
      flushPara();
      const buf: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i]!)) buf.push(lines[i++]!.replace(/^\s*>\s?/, ''));
      blocks.push({ t: 'quote', text: buf.join('\n') });
      continue;
    }
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    if (ul) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i]!.match(/^\s*[-*•]\s+(.*)$/);
        if (m) { items.push(m[1]!); i++; }
        else if (/^\s{2,}\S/.test(lines[i]!) && items.length) { items[items.length - 1] += ' ' + lines[i]!.trim(); i++; }
        else break;
      }
      blocks.push({ t: 'ul', items });
      continue;
    }
    const ol = line.match(/^\s*(\d+)(?:[.)]\s+|、\s*)(.*)$/);
    if (ol) {
      flushPara();
      const items: string[] = [];
      const start = Number(ol[1]);
      while (i < lines.length) {
        const m = lines[i]!.match(/^\s*(\d+)(?:[.)]\s+|、\s*)(.*)$/);
        if (m) { items.push(m[2]!); i++; }
        else if (/^\s{2,}\S/.test(lines[i]!) && items.length) { items[items.length - 1] += ' ' + lines[i]!.trim(); i++; }
        else break;
      }
      blocks.push({ t: 'ol', items, start });
      continue;
    }
    para.push(line);
    i++;
  }
  flushPara();
  return blocks;
}

/** 行内标记:`code` **bold** *em* ~~del~~ [text](url) */
export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(~~[^~]+~~)|(\*[^*\s][^*]*\*)|(_[^_\s][^_]*_)|(\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (m[1]) out.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    else if (m[2] || m[3]) out.push(<strong key={k++}>{renderInline(tok.slice(2, -2))}</strong>);
    else if (m[4]) out.push(<del key={k++}>{tok.slice(2, -2)}</del>);
    else if (m[5] || m[6]) out.push(<em key={k++}>{renderInline(tok.slice(1, -1))}</em>);
    else if (m[7]) {
      const label = tok.slice(1, tok.indexOf(']('));
      out.push(<a key={k++} href={m[8]} target="_blank" rel="noopener noreferrer">{label}</a>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function lines(text: string): ReactNode[] {
  const parts = text.split('\n');
  return parts.flatMap((l, i) => (i < parts.length - 1 ? [...renderInline(l), <br key={`br${i}`} />] : renderInline(l)));
}

export function Markdown({ text }: { text: string }) {
  const blocks = parseMarkdown(text);
  return (
    <div className="md">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h': {
            const Tag = (`h${Math.min(4, b.level + 1)}` as 'h2' | 'h3' | 'h4');
            return <Tag key={i}>{renderInline(b.text)}</Tag>;
          }
          case 'p': return <p key={i}>{lines(b.text)}</p>;
          case 'ul': return <ul key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>;
          case 'ol': return <ol key={i} start={b.start}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>;
          case 'quote': return <blockquote key={i}>{lines(b.text)}</blockquote>;
          case 'hr': return <hr key={i} />;
          case 'code': return <pre key={i}><code>{b.text}</code></pre>;
          case 'table': return (
            <div key={i} className="md-table-wrap">
              <table>
                <thead><tr>{b.head.map((c, j) => <th key={j}>{renderInline(c)}</th>)}</tr></thead>
                <tbody>
                  {b.rows.map((r, j) => (
                    <tr key={j}>{b.head.map((_, k) => <td key={k}>{renderInline(r[k] ?? '')}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      })}
    </div>
  );
}

/**
 * Markdown 解析:表格、标题、列表、代码块、行内标记,以及流式半成品的容错。
 */
import { describe, expect, test } from 'vitest';
import { parseMarkdown } from '../src/lib/markdown.js';

describe('parseMarkdown', () => {
  test('表格(含首尾竖线与对齐分隔行)', () => {
    const src = ['| 宫位 | 主星 | 亮度 |', '|:---|:---:|---:|', '| 命宫 | 紫微 | 旺 |', '| 财帛 | 武曲 \\| 天府 | 庙 |'].join('\n');
    const [t] = parseMarkdown(src);
    expect(t).toEqual({ t: 'table', head: ['宫位', '主星', '亮度'], rows: [['命宫', '紫微', '旺'], ['财帛', '武曲 | 天府', '庙']] });
  });

  test('只有表头没有分隔行 → 按段落处理(流式未完成)', () => {
    const [p] = parseMarkdown('| 宫位 | 主星 |');
    expect(p?.t).toBe('p');
  });

  test('标题、列表、引用、分隔线、代码', () => {
    const src = ['## 命格总断', '- 一', '- 二', '1. 甲', '2. 乙', '> 引', '---', '```', 'x | y', '```', '末段'].join('\n');
    const types = parseMarkdown(src).map((b) => b.t);
    expect(types).toEqual(['h', 'ul', 'ol', 'quote', 'hr', 'code', 'p']);
    const ul = parseMarkdown(src)[1];
    expect(ul).toEqual({ t: 'ul', items: ['一', '二'] });
    const code = parseMarkdown(src)[5];
    expect(code).toEqual({ t: 'code', lang: '', text: 'x | y' });
  });

  test('中文顿号序号与连续段落', () => {
    const blocks = parseMarkdown('1、事业\n2、财运\n\n第一段\n第二行\n\n第二段');
    expect(blocks[0]).toEqual({ t: 'ol', items: ['事业', '财运'], start: 1 });
    expect(blocks[1]).toEqual({ t: 'p', text: '第一段\n第二行' });
    expect(blocks[2]).toEqual({ t: 'p', text: '第二段' });
  });

  test('未闭合代码块不抛错', () => {
    expect(() => parseMarkdown('```\nabc')).not.toThrow();
    expect(parseMarkdown('```\nabc')[0]).toEqual({ t: 'code', lang: '', text: 'abc' });
  });
});

/**
 * 思考/正文分流:reasoning_content 字段、<think> 标签(含跨增量切分)。
 */
import { describe, expect, test } from 'vitest';
import { deltasFromJson, ThinkTagSplitter } from '../src/reasoning.js';

const j = (delta: Record<string, unknown>) => JSON.stringify({ choices: [{ delta }] });

describe('ThinkTagSplitter', () => {
  test('整段标签', () => {
    const s = new ThinkTagSplitter();
    expect(s.push('<think>思考</think>正文')).toEqual([{ reasoning: '思考' }, { text: '正文' }]);
    expect(s.flush()).toEqual([]);
  });

  test('标签跨增量切分,不泄漏半个标签', () => {
    const s = new ThinkTagSplitter();
    const out = [...s.push('<thi'), ...s.push('nk>先想'), ...s.push('一想</th'), ...s.push('ink>答案'), ...s.flush()];
    const reasoning = out.filter((d) => d.reasoning).map((d) => d.reasoning).join('');
    const text = out.filter((d) => d.text).map((d) => d.text).join('');
    expect(reasoning).toBe('先想一想');
    expect(text).toBe('答案');
    expect(out.some((d) => (d.text ?? '').includes('<') || (d.reasoning ?? '').includes('<'))).toBe(false);
  });

  test('无标签时全为正文;流末尾未闭合标签按思考冲出', () => {
    const s = new ThinkTagSplitter();
    expect(s.push('普通正文')).toEqual([{ text: '普通正文' }]);
    const t = new ThinkTagSplitter();
    const out = [...t.push('<think>未完'), ...t.push('</thi'), ...t.flush()];
    // 已进入思考态:内容按思考输出;末尾半个闭合标签在 flush 时也归入思考(不当正文泄漏)
    expect(out.map((d) => d.reasoning ?? '').join('')).toBe('未完</thi');
    expect(out.some((d) => d.text)).toBe(false);
  });

  test('小于号但非标签的正文原样输出', () => {
    const s = new ThinkTagSplitter();
    const out = [...s.push('a < b 且 <b>加粗</b>'), ...s.flush()];
    expect(out.map((d) => d.text).join('')).toBe('a < b 且 <b>加粗</b>');
  });
});

describe('deltasFromJson', () => {
  test('reasoning_content 与 reasoning 字段', () => {
    const s = new ThinkTagSplitter();
    expect(deltasFromJson(j({ reasoning_content: '推理' }), s)).toEqual([{ reasoning: '推理' }]);
    expect(deltasFromJson(j({ reasoning: '推理2' }), s)).toEqual([{ reasoning: '推理2' }]);
    expect(deltasFromJson(j({ content: '正文' }), s)).toEqual([{ text: '正文' }]);
    expect(deltasFromJson(j({ content: null, reasoning_content: null }), s)).toEqual([]);
  });

  test('同一增量同时含思考与正文,顺序为思考在前', () => {
    const s = new ThinkTagSplitter();
    expect(deltasFromJson(j({ reasoning_content: 'r', content: 't' }), s)).toEqual([{ reasoning: 'r' }, { text: 't' }]);
  });
});

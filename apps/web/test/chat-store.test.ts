/**
 * 对话存储测试(内存后端)。
 */
import { describe, expect, test } from 'vitest';
import {
  ChatStore,
  conversationTitle,
  conversationToMarkdown,
  createMemoryStorage,
  historyFor,
  newConversation,
} from '../src/lib/chat-store.js';

const at = (s: string) => new Date(s).toISOString();

describe('ChatStore', () => {
  test('保存、按盘筛选、按更新时间倒序、删除', () => {
    const store = new ChatStore(createMemoryStorage());
    const a = { ...newConversation('h1', '男命 1990'), id: 'a', title: 'A', updatedAt: at('2026-01-01') };
    const b = { ...newConversation('h1', '男命 1990'), id: 'b', title: 'B', updatedAt: at('2026-02-01') };
    const c = { ...newConversation('h2', '女命 2000'), id: 'c', title: 'C', updatedAt: at('2026-03-01') };
    store.save(a);
    store.save(b);
    store.save(c);
    expect(store.list().map((x) => x.id)).toEqual(['c', 'b', 'a']);
    expect(store.list('h1').map((x) => x.id)).toEqual(['b', 'a']);
    store.remove('b');
    expect(store.list('h1').map((x) => x.id)).toEqual(['a']);
    store.clear('h2');
    expect(store.list().map((x) => x.id)).toEqual(['a']);
  });

  test('覆盖同 id 并淘汰最久未更新', () => {
    const store = new ChatStore(createMemoryStorage(), 2);
    for (const [id, day] of [['x', '01'], ['y', '02'], ['z', '03']] as const) {
      store.save({ ...newConversation('h', 'L'), id, updatedAt: at(`2026-01-${day}`) });
    }
    expect(store.list().map((x) => x.id)).toEqual(['z', 'y']);
    store.save({ ...newConversation('h', 'L'), id: 'y', title: '改', updatedAt: at('2026-01-09') });
    expect(store.list()[0]).toMatchObject({ id: 'y', title: '改' });
    expect(store.list()).toHaveLength(2);
  });

  test('损坏数据不致崩溃', () => {
    const storage = createMemoryStorage();
    storage.setItem('ziwei.chats.v1', '{not json');
    expect(new ChatStore(storage).list()).toEqual([]);
  });

  test('导出 JSON 含全部对话', () => {
    const store = new ChatStore(createMemoryStorage());
    store.save({ ...newConversation('h', 'L'), id: 'q', title: '问事业' });
    const json = JSON.parse(store.exportJson()) as { conversations: { title: string }[] };
    expect(json.conversations[0]!.title).toBe('问事业');
  });
});

describe('historyFor / 标题 / Markdown', () => {
  const conv = {
    ...newConversation('h', '男命 1990-1-15'),
    title: '事业',
    turns: [
      { role: 'user' as const, content: '事业如何?', at: at('2026-01-01'), context: '[运限上下文]流年丙午' },
      { role: 'assistant' as const, content: '答A1', at: at('2026-01-01'), label: 'A' },
      { role: 'assistant' as const, content: '答B1', at: at('2026-01-01'), label: 'B' },
      { role: 'assistant' as const, content: '出错', at: at('2026-01-01'), label: 'C', error: true },
      { role: 'user' as const, content: '再具体些', at: at('2026-01-02') },
    ],
  };

  test('只带本回答方的有效回答,用户轮附运限上下文,末尾未答问题剔除', () => {
    const h = historyFor(conv, 'A');
    expect(h).toEqual([
      { role: 'user', content: '事业如何?\n\n[运限上下文]流年丙午' },
      { role: 'assistant', content: '答A1' },
    ]);
    expect(historyFor(conv, 'C')).toEqual([]);
  });

  test('标题截断与兜底', () => {
    expect(conversationTitle('   ', '整体命格')).toBe('整体命格');
    expect(conversationTitle('一'.repeat(30), 'x')).toBe(`${'一'.repeat(24)}…`);
    expect(conversationTitle('我 的  事业', 'x')).toBe('我 的 事业');
  });

  test('Markdown 含标题、命盘、问答与免责声明', () => {
    const md = conversationToMarkdown(conv);
    expect(md).toContain('# 事业');
    expect(md).toContain('男命 1990-1-15');
    expect(md).toContain('**答(A)**');
    expect(md).toContain('> [运限上下文]流年丙午');
    expect(md.endsWith('不构成医疗/投资/重大决策建议。')).toBe(true);
  });
});

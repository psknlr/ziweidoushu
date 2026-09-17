/**
 * 推理型模型输出分流:把上游增量拆成「思考」与「正文」。
 * 兼容两种协议:
 * - OpenAI 兼容扩展字段 delta.reasoning_content / delta.reasoning(DeepSeek-R1、MiniMax、Qwen 等)
 * - 正文内联 <think>…</think> 标签(部分自部署模型)
 * 标签可能被切分在多个增量中,故用带缓冲的状态机逐字符处理。
 */

export interface StreamDelta {
  text?: string;
  reasoning?: string;
}

const OPEN = '<think>';
const CLOSE = '</think>';

export class ThinkTagSplitter {
  private inThink = false;
  private buffer = '';

  /** 喂入一段正文增量,返回拆分后的增量列表 */
  push(chunk: string): StreamDelta[] {
    this.buffer += chunk;
    const out: StreamDelta[] = [];
    for (;;) {
      const tag = this.inThink ? CLOSE : OPEN;
      const at = this.buffer.indexOf(tag);
      if (at === -1) {
        // 保留可能是标签前缀的尾部,其余可安全输出
        const keep = partialSuffix(this.buffer, tag);
        const emit = this.buffer.slice(0, this.buffer.length - keep);
        if (emit) out.push(this.inThink ? { reasoning: emit } : { text: emit });
        this.buffer = this.buffer.slice(this.buffer.length - keep);
        return out;
      }
      const before = this.buffer.slice(0, at);
      if (before) out.push(this.inThink ? { reasoning: before } : { text: before });
      this.buffer = this.buffer.slice(at + tag.length);
      this.inThink = !this.inThink;
    }
  }

  /** 流结束:冲出缓冲 */
  flush(): StreamDelta[] {
    const rest = this.buffer;
    this.buffer = '';
    if (!rest) return [];
    return [this.inThink ? { reasoning: rest } : { text: rest }];
  }
}

/** buffer 末尾与 tag 前缀重合的长度(如 buffer 以 "<thi" 结尾且 tag 为 "<think>" → 4) */
function partialSuffix(buffer: string, tag: string): number {
  const max = Math.min(buffer.length, tag.length - 1);
  for (let n = max; n > 0; n--) {
    if (buffer.endsWith(tag.slice(0, n))) return n;
  }
  return 0;
}

/** 解析一条 OpenAI 兼容 SSE data JSON,返回结构化增量(无内容时为空数组) */
export function deltasFromJson(data: string, splitter: ThinkTagSplitter): StreamDelta[] {
  const parsed = JSON.parse(data) as {
    choices?: { delta?: { content?: string | null; reasoning_content?: string | null; reasoning?: string | null } }[];
  };
  const d = parsed.choices?.[0]?.delta;
  if (!d) return [];
  const out: StreamDelta[] = [];
  const reasoning = d.reasoning_content ?? d.reasoning;
  if (reasoning) out.push({ reasoning });
  if (d.content) out.push(...splitter.push(d.content));
  return out;
}

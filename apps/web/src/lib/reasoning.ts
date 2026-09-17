/**
 * 推理型模型输出分流(前端版,与网关 reasoning.ts 同一算法):
 * delta.reasoning_content / delta.reasoning 字段 → 思考;正文内 <think>…</think> → 思考。
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

  push(chunk: string): StreamDelta[] {
    this.buffer += chunk;
    const out: StreamDelta[] = [];
    for (;;) {
      const tag = this.inThink ? CLOSE : OPEN;
      const at = this.buffer.indexOf(tag);
      if (at === -1) {
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

  flush(): StreamDelta[] {
    const rest = this.buffer;
    this.buffer = '';
    if (!rest) return [];
    return [this.inThink ? { reasoning: rest } : { text: rest }];
  }
}

function partialSuffix(buffer: string, tag: string): number {
  const max = Math.min(buffer.length, tag.length - 1);
  for (let n = max; n > 0; n--) if (buffer.endsWith(tag.slice(0, n))) return n;
  return 0;
}

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

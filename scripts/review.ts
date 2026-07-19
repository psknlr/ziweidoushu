/**
 * 知识库审核 CLI(人工审核流水线的操作端)。
 *
 * 用法:
 *   npx tsx scripts/review.ts stats                          # 各状态/领域统计
 *   npx tsx scripts/review.ts list [--domain star] [--limit 20]   # 待审核清单
 *   npx tsx scripts/review.ts show <id>                      # 查看条目全文
 *   npx tsx scripts/review.ts approve <id...> --reviewer 张三 [--verified] [--note 备注]
 *   npx tsx scripts/review.ts revoke <id...>                 # 撤销审核(回退 draft)
 *   npx tsx scripts/review.ts audit                          # 台账健康检查(CI 同款)
 *
 * approve 将条目当前 contentHash 写入台账;此后条目内容一旦变更,
 * 审核自动失效(audit/CI 会报 stale),须重审。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  RAW_ENTRIES,
  applyReviewLedger,
  entryContentHash,
  type ReviewLedger,
  type ReviewRecord,
} from '../packages/knowledge/src/index.js';

const LEDGER_PATH = join(dirname(fileURLToPath(import.meta.url)), '../packages/knowledge/review/ledger.json');

const readLedger = (): ReviewLedger => JSON.parse(readFileSync(LEDGER_PATH, 'utf-8')) as ReviewLedger;
const writeLedger = (ledger: ReviewLedger): void => {
  ledger.records.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
};

const args = process.argv.slice(2);
const command = args[0];
const flag = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};
const hasFlag = (name: string): boolean => args.includes(`--${name}`);
const positional = args.slice(1).filter((a, i, arr) => !a.startsWith('--') && arr[i - 1]?.startsWith('--') !== true || (a.startsWith('--') ? false : !arr[i - 1]?.startsWith('--')));

function effectiveEntries() {
  return applyReviewLedger(RAW_ENTRIES, readLedger());
}

switch (command) {
  case 'stats': {
    const { entries } = effectiveEntries();
    const byStatus = new Map<string, number>();
    const byDomain = new Map<string, number>();
    for (const e of entries) {
      byStatus.set(e.reviewStatus, (byStatus.get(e.reviewStatus) ?? 0) + 1);
      if (e.reviewStatus === 'draft') byDomain.set(e.domain, (byDomain.get(e.domain) ?? 0) + 1);
    }
    console.log(`知识库共 ${entries.length} 条`);
    for (const [status, n] of [...byStatus].sort()) console.log(`  ${status.padEnd(8)} ${n}`);
    console.log('待审核(draft)按领域:');
    for (const [domain, n] of [...byDomain].sort()) console.log(`  ${domain.padEnd(12)} ${n}`);
    break;
  }

  case 'list': {
    const domain = flag('domain');
    const limit = Number(flag('limit') ?? 20);
    const { entries } = effectiveEntries();
    const drafts = entries.filter((e) => e.reviewStatus === 'draft' && (!domain || e.domain === domain));
    console.log(`待审核 ${drafts.length} 条${domain ? `(domain=${domain})` : ''},显示前 ${Math.min(limit, drafts.length)} 条:\n`);
    for (const e of drafts.slice(0, limit)) {
      console.log(`  ${e.id.padEnd(30)} ${e.content.summary}`);
    }
    break;
  }

  case 'show': {
    const id = args[1];
    const entry = RAW_ENTRIES.find((e) => e.id === id);
    if (!entry) {
      console.error(`未找到条目: ${id}`);
      process.exit(1);
    }
    const record = readLedger().records.find((r) => r.id === id);
    console.log(JSON.stringify(entry, null, 2));
    console.log(`\ncontentHash: ${entryContentHash(entry)}`);
    if (record) {
      const fresh = record.contentHash === entryContentHash(entry);
      console.log(`台账: ${record.status} by ${record.reviewer} @ ${record.date}${fresh ? '' : '  ⚠ 内容已变更,审核已失效'}`);
    }
    break;
  }

  case 'approve': {
    const reviewer = flag('reviewer');
    if (!reviewer) {
      console.error('approve 需要 --reviewer <名字>(审核责任落名)');
      process.exit(1);
    }
    const status: ReviewRecord['status'] = hasFlag('verified') ? 'verified' : 'reviewed';
    const note = flag('note');
    const ids = args.slice(1).filter((a) => !a.startsWith('--') && a !== reviewer && a !== note);
    if (ids.length === 0) {
      console.error('approve 需要至少一个条目 id');
      process.exit(1);
    }
    const ledger = readLedger();
    const date = new Date().toISOString().slice(0, 10);
    for (const id of ids) {
      const entry = RAW_ENTRIES.find((e) => e.id === id);
      if (!entry) {
        console.error(`跳过:未找到条目 ${id}`);
        continue;
      }
      const record: ReviewRecord = {
        id,
        status,
        reviewer,
        date,
        contentHash: entryContentHash(entry),
        ...(note ? { note } : {}),
      };
      const existing = ledger.records.findIndex((r) => r.id === id);
      if (existing !== -1) ledger.records[existing] = record;
      else ledger.records.push(record);
      console.log(`✔ ${id} → ${status} (by ${reviewer})`);
    }
    writeLedger(ledger);
    break;
  }

  case 'revoke': {
    const ids = args.slice(1).filter((a) => !a.startsWith('--'));
    const ledger = readLedger();
    const before = ledger.records.length;
    ledger.records = ledger.records.filter((r) => !ids.includes(r.id));
    writeLedger(ledger);
    console.log(`已撤销 ${before - ledger.records.length} 条审核记录`);
    break;
  }

  case 'audit': {
    const result = effectiveEntries();
    const ledger = readLedger();
    console.log(`台账 ${ledger.records.length} 条记录`);
    if (result.stale.length > 0) {
      console.error(`⚠ ${result.stale.length} 条已审核条目的内容被修改(已回退 draft,需重审):`);
      for (const id of result.stale) console.error(`  ${id}`);
    }
    if (result.unknown.length > 0) {
      console.error(`⚠ ${result.unknown.length} 条台账记录指向不存在的条目:`);
      for (const id of result.unknown) console.error(`  ${id}`);
    }
    if (result.stale.length === 0 && result.unknown.length === 0) {
      console.log('✔ 台账健康:无 stale、无 unknown');
    } else {
      process.exit(1);
    }
    break;
  }

  default:
    console.log('用法: npx tsx scripts/review.ts <stats|list|show|approve|revoke|audit> [参数]');
    console.log('详见文件头注释。');
    process.exit(command ? 1 : 0);
}

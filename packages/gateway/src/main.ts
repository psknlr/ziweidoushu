/**
 * 网关启动入口:npm run -w @ziwei/gateway start
 * 环境变量:
 *   ZIWEI_PROVIDER=minimax|azure|poe|litellm|custom (默认取第一个配置齐全的)
 *   PORT=8787
 * 各供应商所需变量见 providers.ts。
 */
import { availableProviders, resolveProvider, type ProviderName } from './providers.js';
import { createGatewayServer } from './server.js';

const configured = availableProviders();
const requested = process.env['ZIWEI_PROVIDER'] as ProviderName | undefined;
const name = requested ?? configured[0];

if (!name) {
  console.error(
    '[@ziwei/gateway] 未发现任何已配置的供应商。请设置其一:\n' +
      '  MINIMAX_API_KEY / POE_API_KEY / LITELLM_API_KEY / OPENAI_API_KEY\n' +
      '  或 AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY + AZURE_OPENAI_DEPLOYMENT',
  );
  process.exit(1);
}

const provider = resolveProvider(name);
const port = Number(process.env['PORT'] ?? 8787);
const staticDir = process.env['ZIWEI_STATIC_DIR'];
createGatewayServer({ provider, staticDir }).listen(port, () => {
  console.log(`[@ziwei/gateway] 监听 :${port}  供应商=${provider.name}  模型=${provider.model}`);
  console.log(`[@ziwei/gateway] 已配置供应商: ${configured.join(', ') || '(无)'}`);
  if (staticDir) console.log(`[@ziwei/gateway] 静态托管: ${staticDir}(工作台与 API 同源单进程)`);
});

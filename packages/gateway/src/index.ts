/** @ziwei/gateway —— 服务端 AI 解读网关(L4)。 */
export {
  resolveProvider,
  availableProviders,
  upstreamRequest,
  type ProviderName,
  type ProviderConfig,
} from './providers.js';
export { streamChat, type ChatMessage, type ChatRequest } from './stream.js';
export { createGatewayServer, type GatewayOptions } from './server.js';

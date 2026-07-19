# 紫微斗数工作台 —— 单容器部署:网关(API)+ 静态托管(前端)同源单进程
#
#   docker build -t ziwei-app .
#   docker run -p 8787:8787 -e MINIMAX_API_KEY=xxx ziwei-app
#   # 或 -e ZIWEI_PROVIDER=azure -e AZURE_OPENAI_ENDPOINT=... -e AZURE_OPENAI_API_KEY=... -e AZURE_OPENAI_DEPLOYMENT=...
#
# 打开 http://localhost:8787 即为完整工作台(排盘端侧,AI 走同源 /api)。

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/core/package.json packages/core/package.json
COPY packages/knowledge/package.json packages/knowledge/package.json
COPY packages/gateway/package.json packages/gateway/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci
COPY tsconfig.json vitest.config.ts ./
COPY packages packages
COPY apps apps
RUN npm run -w @ziwei/web build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages packages
COPY --from=build /app/apps/web/package.json apps/web/package.json
COPY --from=build /app/apps/web/dist apps/web/dist
COPY --from=build /app/tsconfig.json ./
# 运行时依赖:workspace 包 + tsx(直接运行 TS 源,无需产物构建)
RUN npm ci --omit=dev --ignore-scripts && npm install --no-save tsx@4

ENV PORT=8787
ENV ZIWEI_STATIC_DIR=/app/apps/web/dist
EXPOSE 8787
CMD ["npx", "tsx", "packages/gateway/src/main.ts"]

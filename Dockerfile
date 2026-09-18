# Build stage: install everything and compile the React client and the Express server.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci
COPY client client
COPY server server
RUN npm run build

# Runtime stage: production dependencies for the server only, plus the two build outputs.
# The layout mirrors the repo so server/dist/app.js finds ../../client/dist.
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=4000
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci --omit=dev --workspace=server && npm cache clean --force
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/client/dist client/dist
USER node
EXPOSE 4000
CMD ["node", "server/dist/index.js"]

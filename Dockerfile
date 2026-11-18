FROM node:22-bookworm-slim AS frontend-build
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-bookworm-slim AS admin-build
WORKDIR /build/admin
COPY admin/package*.json ./
RUN npm ci
COPY admin/ ./
RUN npm run build

FROM node:22-bookworm-slim AS app
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend/ ./backend/
COPY --from=frontend-build /build/frontend/dist ./frontend/dist
COPY --from=admin-build /build/admin/dist ./admin/dist
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 10000
CMD ["sh", "-c", "npm run seed && npm start"]

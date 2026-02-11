ARG NODE_VERSION=24.13.0
FROM node:${NODE_VERSION} AS build-stage
WORKDIR /app
# 패키지 정보만 먼저 복사 (캐시 활용을 위해)
COPY package*.json ./
# 모든 의존성 설치 (devDependencies 포함 -> 빌드용)
RUN npm ci
# 소스 코드 및 설정 파일 복사
COPY . .
# Prisma 클라이언트 생성 (타입 등 생성)
RUN npx prisma generate
# TypeScript 빌드 (dist 폴더 생성)
RUN npm run build

FROM node:${NODE_VERSION}-slim
WORKDIR /app
# 환경 변수 설정 (기본값)
ENV SERVER_PORT=3000
# 빌드 스테이지에서 생성된 'dist' 폴더만 복사
COPY --from=build-stage /app/dist ./dist
# 패키지 정보 복사
COPY --from=build-stage /app/package*.json ./
# Prisma 스키마 복사
COPY --from=build-stage /app/prisma ./prisma
# 프로덕션 의존성만 설치 (가볍게)
# --omit=dev: devDependencies 제외
RUN npm ci --omit=dev
# Prisma 클라이언트 다시 생성 (운영 환경 런타임에 맞춰 최적화)
RUN npx prisma generate
# 서버 실행
CMD ["npm", "run", "start"]
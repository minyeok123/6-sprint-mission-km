# 베이스 이미지 버전을 빌드 인자로 받음 
ARG NODE_VERSION
FROM node:${NODE_VERSION}

# 환경 변수 설정
ENV SERVER_PORT=3000

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위해 package 파일 복사
COPY . /app

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성 (DB 사용 시 필수)
RUN npx prisma generate

# TypeScript 빌드 (dist 폴더 생성)
RUN npm run build

# 서버 실행
CMD ["npm", "run", "start"]
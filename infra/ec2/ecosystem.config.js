module.exports = {
  apps: [
    {
      name: 'panda-market-api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      kill_timeout: 5000,
      env: {
        // 기본 환경 설정 (개발/테스트용)
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        // 프로덕션 환경 설정 (--env production 옵션으로 실행 시 적용)
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};

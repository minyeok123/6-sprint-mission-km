module.exports = {
  apps: [
    {
      name: 'panda-market-api', // PM2에서 관리할 앱 이름
      script: 'dist/main.js', // 실행할 엔트리 포인트 (빌드된 JS 파일)
      instances: 1, // 프리티어(t2.micro)는 CPU가 1개이므로 1개만 실행
      exec_mode: 'fork', // 클러스터 대신 포크 모드 사용
      wait_ready: true, // process.send('ready') 신호를 기다림 (필요 시)
      listen_timeout: 50000, // ready 신호를 기다리는 시간
      kill_timeout: 5000, // 종료 시그널 후 강제 종료까지 대기 시간
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};

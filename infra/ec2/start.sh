npm install
npx prisma generate
npx prisma migrate deploy
npm run build

pm2 start infra/ec2/ecosystem.config.js
#!/bin/sh

# Aguarda o banco estar acessível
echo "⏳ Aguardando o banco ficar disponível..."
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# Inicia o app
echo "🚀 Inicializando o servidor..."
npm run start

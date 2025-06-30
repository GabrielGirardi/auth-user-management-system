# 🧑‍💼 Auth User Management System

Sistema base para controle e gerenciamento de usuários, incluindo autenticação, permissões por cargo, CRUD de pessoas vinculadas a usuários e suporte a tema escuro 🌙.

## 🚀 Tecnologias Utilizadas

- [Next.js 15+ (App Router)](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [next-themes](https://github.com/pacocoursey/next-themes) (modo escuro)
- [Lucide Icons](https://lucide.dev/)

---

## 📦 Instalação

```bash
git clone https://github.com/seu-usuario/auth-user-management-system.git
cd auth-user-management-system
npm install
```
Configure o banco de dados no arquivo .env seguindo o modelo do example.env

Rodar as migration e o seed
```bash
npm run db:migrate
npm run db:seed
npm run db:generate
```

## 📦 Execução com Docker
O projeto inclui suporte completo a Docker e Docker Compose. Isso permite subir tanto a aplicação quanto o banco PostgreSQL em containers, com persistência e migração automática de banco.

1. 🐘 Banco de Dados + App com Docker Compose

Crie um arquivo .env baseado no example.env com a URL do banco apontando para o container:
```
DATABASE_URL="postgresql://postgres:postgres@db:5432/auth_user_sys"
```

2. 📁 Dockerfile

Verifique o dockerfile
```
# Dockerfile
FROM node:22.14-alpine

WORKDIR /app

COPY . .

RUN cp example.env .env
RUN npm install
RUN npm run build

COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
```

3. ▶️ Entrypoint de inicialização

Crie um arquivo entrypoint.sh na raiz do projeto caso não existir com:
```
#!/bin/sh

# Aguarda o banco estar acessível
echo "⏳ Aguardando o banco ficar disponível..."
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# Inicia o app
echo "🚀 Inicializando o servidor..."
npm run start
```

então de a permissão:
```bash
chmod +x entrypoint.sh
```

4. 🧱 docker-compose.yml
```
version: "3.9"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/auth_user_sys
    depends_on:
      - db

  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: auth_user_sys
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

5. ✅ Rodando o projeto com Docker
```bash
docker-compose up --build
```

## 🧠 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- 👨‍👩‍👧 Gerenciamento de pessoas físicas vinculadas a usuários
- 🛡️ Permissões baseadas em cargo (ADMIN e VIEWER)
- 🌗 Suporte a tema claro/escuro
- 🚫 Restrição de deleção se a pessoa estiver vinculada a um usuário
- 📊 Dashboard com contagem de usuários ativos e visíveis
- 📱 Design responsivo com drawer para visualização de dados no mobile (Basta clicar na primeira coluna nos registros da tabela)

## 👥 Permissões por Cargo

Cargo	  Visualizar	Criar/Editar	Excluir
VIEWER	✅	        ❌	          ❌
ADMIN	  ✅	        ✅	          ✅

## 💡 Comandos úteis

npm run dev       # Inicia o servidor em modo dev
npm run build     # Cria a versão de produção
npx prisma studio # UI para o banco de dados

---

## 🧾 Licença

Este projeto é licenciado sob a MIT License

Feito com ♥ por Gabriel Girardi.

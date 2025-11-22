# Plano de Lançamento em Produção (Vercel + Supabase)

Este documento descreve o passo a passo para colocar o projeto **Mordomy** em produção.

## 1. Preparação do Banco de Dados (Supabase)

Já configuramos o projeto para suportar o Supabase, mas precisamos garantir que o banco de produção esteja pronto.

-   [ ] **Obter Connection String**:
    -   Acesse o dashboard do Supabase.
    -   Vá em `Settings` -> `Database`.
    -   Copie a URI (Mode: Session) para uso nas migrations.
    -   Copie a URI (Mode: Transaction) para uso na aplicação (Vercel), se disponível (recomendado para serverless).
-   [ ] **Aplicar Migrations**:
    -   Precisamos rodar as migrations no banco do Supabase para criar as tabelas.
    -   Comando local: `DATABASE_URL="sua_string_supabase" npx prisma migrate deploy`

## 2. Configuração na Vercel

-   [ ] **Criar Projeto**:
    -   Importar o repositório do GitHub no dashboard da Vercel.
-   [ ] **Variáveis de Ambiente (Environment Variables)**:
    -   Configurar as seguintes chaves na Vercel:
        -   `DATABASE_URL`: A string de conexão do Supabase (Use a porta 6543 com `?pgbouncer=true` se estiver usando o Transaction Pooler, ou a porta 5432 direta se não).
        -   `NEXTAUTH_SECRET`: Gere uma nova string aleatória (pode usar `openssl rand -base64 32`).
        -   `NEXTAUTH_URL`: A URL do seu projeto na Vercel (ex: `https://mordomy.vercel.app`). *Nota: A Vercel configura isso automaticamente para previews, mas para produção é bom fixar ou deixar o NextAuth detectar.*
        -   `NEXT_PUBLIC_SUPABASE_URL`: Sua URL do projeto Supabase.
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua chave pública do Supabase.

## 3. Ajustes no Código (Se necessário)

-   [ ] **Build Check**:
    -   Rodar `npm run build` localmente para garantir que não há erros de TypeScript ou ESLint impedindo o deploy.
-   [ ] **Prisma Client**:
    -   O comando `postinstall` geralmente gera o cliente Prisma, mas na Vercel o comando de build padrão `next build` já deve lidar com isso se o script de build incluir `prisma generate` ou se a Vercel detectar o Prisma.
    -   *Recomendação*: Atualizar `package.json` scripts: `"build": "prisma generate && next build"`.

## 4. Processo de Deploy

1.  Commitar e dar Push de todas as alterações para o GitHub.
2.  A Vercel detectará o push e iniciará o build.
3.  Acompanhar os logs na Vercel.

## 5. Verificação Pós-Deploy

-   [ ] Acessar a URL de produção.
-   [ ] Tentar fazer Login.
-   [ ] Verificar se os dados carregam corretamente (estará vazio inicialmente, pois é um banco novo).

# Configuração de Banco de Dados (Local vs Supabase)

Este projeto está configurado para trabalhar com dois ambientes de banco de dados:
1.  **Local (Docker)**: Para desenvolvimento diário.
2.  **Supabase (Produção)**: Para quando o projeto estiver online.

## 1. Desenvolvimento Local (Padrão)

O arquivo `.env` já está configurado para usar o banco local:

```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/mordomy?schema=public"
```

Para rodar o banco local:
```bash
docker-compose up -d
```

Para aplicar mudanças no schema (tabelas):
```bash
npx prisma migrate dev
```

## 2. Publicando no Supabase

Quando quiser enviar suas alterações para o Supabase:

1.  **Obtenha a URL de Conexão**:
    -   Vá no painel do Supabase -> Settings -> Database.
    -   Copie a "Connection String" (URI).
    -   **Importante**: Se usar a porta 6543 (Transaction Pooler), adicione `?pgbouncer=true` ao final. Se usar 5432 (Session), não precisa.

2.  **Configure o .env**:
    -   Comente a linha do banco local (`# DATABASE_URL=...`).
    -   Descomente ou adicione a linha do Supabase:
        ```env
        DATABASE_URL="postgresql://postgres.seu-projeto:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        ```

3.  **Envie as Migrations**:
    -   Rode o comando para aplicar as tabelas sem resetar os dados:
        ```bash
        npx prisma migrate deploy
        ```

4.  **Volte para Local**:
    -   Desfaça a alteração no `.env` para continuar desenvolvendo localmente.

## Dicas
-   Nunca commite o arquivo `.env` com sua senha real do Supabase.
-   Use `npx prisma studio` para visualizar os dados do banco que estiver ativo no `.env`.

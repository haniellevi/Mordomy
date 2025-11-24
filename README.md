# Mordomy - Gestão Financeira Pessoal

Sistema moderno de gestão financeira pessoal desenvolvido com foco em simplicidade e eficiência.

## 🚀 Tecnologias

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [TailwindCSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Autenticação**: [Supabase Auth](https://supabase.com/auth)

## 📋 Funcionalidades Principais

- **Dashboard Financeiro**: Visão geral de receitas e despesas
- **Gestão Mensal**: Controle detalhado mês a mês
- **Categorização**:
  - Receitas
  - Despesas Fixas/Variáveis
  - Investimentos
  - Gastos Avulsos
- **Dízimo Automático**: Cálculo automático de 10% sobre receitas
- **Drag & Drop**: Organização prioritária de despesas

## 🛠️ Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Conta no Supabase

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/haniellevi/Mordomy.git
   cd Mordomy
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Copie o arquivo de exemplo e preencha com suas credenciais:
   ```bash
   cp .env.example .env
   ```
   
   Variáveis necessárias:
   - `DATABASE_URL` (Connection Pooling)
   - `DIRECT_URL` (Direct Connection)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Configure o Banco de Dados**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000)

## 📚 Documentação

Documentação detalhada disponível na pasta [`PLAN`](./PLAN):

- [Guia de Banco de Dados](./PLAN/DATABASE_SETUP.md)
- [Configuração de Testes (TestSprite)](./PLAN/TESTSPRITE_SETUP.md)

## 🧪 Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Build de produção
- `npm run start`: Inicia servidor de produção
- `npm run lint`: Verifica problemas de código
- `npm run mcp:supabase`: Inicia servidor MCP do Supabase

## 📄 Licença

Este projeto é privado e proprietário.

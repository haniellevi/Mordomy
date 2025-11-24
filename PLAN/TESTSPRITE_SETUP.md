# Configuração do TestSprite MCP

## O que é TestSprite MCP?

TestSprite é um servidor MCP (Model Context Protocol) que permite criar e executar testes automatizados para aplicações web. Através do MCP, assistentes de IA podem interagir com o TestSprite para gerar, executar e gerenciar testes de forma programática.

## Pré-requisitos

- Node.js instalado (versão 16 ou superior)
- NPM ou NPX disponível
- API Key do TestSprite

## Configuração

### 1. Obter API Key

Você precisa de uma API key válida do TestSprite. Se ainda não possui:

1. Acesse o site do TestSprite
2. Crie uma conta ou faça login
3. Gere uma API key no painel de controle

### 2. Configurar Variável de Ambiente

Adicione a API key no arquivo `.env` na raiz do projeto:

```env
TESTSPRITE_API_KEY=sua-api-key-aqui
```

> [!IMPORTANT]
> Nunca commite o arquivo `.env` com a API key real. O arquivo já está protegido pelo `.gitignore`.

### 3. Arquivo de Configuração MCP

O arquivo [`mcp-config.json`](file:///c:/Users/hanie/OneDrive/Documentos/workspace/Mordomy/mcp-config.json) na raiz do projeto contém a configuração do servidor MCP:

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "${TESTSPRITE_API_KEY}"
      }
    }
  }
}
```

### 4. Configuração no Cursor IDE (Opcional)

Se você usa o Cursor IDE, pode adicionar a configuração MCP nas configurações do editor:

1. Abra as configurações do Cursor
2. Procure por "MCP Servers" ou "Model Context Protocol"
3. Adicione a configuração do TestSprite conforme o arquivo `mcp-config.json`

## Como Usar

### Testar Conexão

Para verificar se o servidor MCP está funcionando corretamente:

```bash
npx @testsprite/testsprite-mcp@latest
```

### Uso com Assistentes de IA

Quando configurado corretamente, assistentes de IA compatíveis com MCP (como Claude no Cursor) poderão:

- Criar testes automatizados para suas páginas
- Executar testes de integração
- Validar fluxos de usuário
- Gerar relatórios de teste

### Exemplos de Uso no Projeto Mordomy

#### Testar Fluxo de Login

```
"Crie um teste para verificar o fluxo de login do usuário"
```

#### Testar Dashboard

```
"Teste se o dashboard carrega corretamente e exibe os dados financeiros"
```

#### Testar Criação de Despesa

```
"Crie um teste end-to-end para adicionar uma nova despesa"
```

## Troubleshooting

### Erro: API Key inválida

- Verifique se a variável `TESTSPRITE_API_KEY` está configurada no `.env`
- Confirme que a API key está correta e ativa
- Reinicie o servidor MCP após alterar o `.env`

### Erro: Comando npx não encontrado

- Certifique-se de que o Node.js e npm estão instalados
- Verifique se o PATH inclui o diretório do npm

### Servidor MCP não inicia

- Verifique os logs de erro
- Confirme que não há conflitos de porta
- Tente executar manualmente: `npx @testsprite/testsprite-mcp@latest`

## Recursos Adicionais

- [Documentação do TestSprite](https://testsprite.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Cursor IDE MCP Guide](https://cursor.sh/docs/mcp)

## Próximos Passos

1. Configure sua API key no arquivo `.env`
2. Teste a conexão com o servidor MCP
3. Comece a criar testes para as funcionalidades do Mordomy
4. Integre os testes no seu fluxo de desenvolvimento

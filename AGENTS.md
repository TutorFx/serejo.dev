# Agent Capabilities & Setup

Este projeto possui integrações e skills configuradas para garantir que o assistente (Agent) sempre implemente as versões mais recentes das bibliotecas, evitando código deprecado.

**Regra de Ouro**: Nunca assuma a sintaxe de uma funcionalidade sem confirmar a versão atualizada. Sempre use a base referencial para a biblioteca em questão, garantindo que você não está implementando código deprecado.

## Base Referencial: Vercel AI SDK
Sempre que o trabalho envolver implementações da **Vercel AI SDK** (tool calling, streaming, agents, etc) ou houver dúvida sobre qual método utilizar:
- **Ação Obrigatória**: Consulte e utilize a Skill local configurada na pasta `.agents/skills/ai-sdk/SKILL.md` (ou use a diretiva `@/ai-sdk`). Não tente adivinhar a arquitetura de agents se baseando em conhecimentos antigos.

## Base Referencial: Zod v4 (via MCP)
Sempre que houver qualquer dúvida sobre sintaxe, criação de schemas, validações ou migrações do **Zod**:
- **Ação Obrigatória**: Utilize o servidor MCP configurado para consultar a documentação oficial da versão 4, garantindo a sintaxe moderna (ex: usando `z.email()` em vez da forma deprecada).
- **Regra Restrita**: Lembre-se que o Zod v4 introduziu o namespace nativo `z.iso` (ex: `z.iso.date()`, `z.iso.datetime()`). NUNCA substitua ou apague um schema existente apenas porque sua intuição diz que ele não existe no pacote padrão. Se o código original possui uma validação, confie nela ou consulte a documentação oficial.

**Servidor MCP**: `zod`
**URL**: `https://mcp.inkeep.com/zod/mcp`

**Ferramentas Disponíveis via MCP**:
- `search-zod-v4-docs`: Busca por conteúdos, guias de migração e notas de versão na documentação oficial do Zod v4.
- `ask-question-about-zod-v4`: Permite realizar perguntas diretas para esclarecer a implementação correta de validações ou esquemas, evitando o uso de código deprecado.

## Base Referencial: Nuxt UI (via MCP)
Sempre que houver necessidade de utilizar componentes, ícones ou composables do **Nuxt UI**, evite adivinhar as propriedades ou a estrutura HTML.
- **Ação Obrigatória**: Utilize o servidor MCP `nuxt-ui` para consultar a documentação oficial, templates e guias de migração.

**Servidor MCP**: `nuxt-ui`
**Ferramentas Disponíveis**:
- `search-components`, `search-composables`, `search-icons`, `get-component`, `get-example`, entre outras ferramentas. Utilize para puxar metadata exata do framework antes de criar a UI.

## Base Referencial: Tailwind CSS (via MCP)
Sempre que o trabalho envolver classes complexas, configuração do `tailwind.config`, ou dúvidas sobre espaçamentos e cores oficiais do **Tailwind CSS**.
- **Ação Obrigatória**: Utilize o servidor MCP `tailwind-mcp` para gerar paletas, visualizar os utilitários exatos ou consultar variáveis de design.

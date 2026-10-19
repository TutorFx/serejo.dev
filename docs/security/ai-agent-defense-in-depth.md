# Defesa em profundidade do agente de IA

O assistente do portfólio (`/chat` e o popup em todas as páginas) é um agente Gemini com tools: busca no conteúdo do site (RAG), consulta de disponibilidade e solicitação de reunião no Google Calendar. Visitantes são anônimos. Este documento descreve as camadas de proteção, os limites configurados e o que fazer em incidentes.

## Princípios

1. **Nada secreto no prompt.** O prompt pode vazar. Todo controle real fica no código.
2. **O modelo não é fronteira de autorização.** Regras de negócio são revalidadas no servidor, independentemente do que o modelo envia.
3. **O cliente só envia texto do usuário e decisões de aprovação.** Histórico, inputs e outputs de tools vêm sempre do banco.
4. **O humano fecha o ciclo.** Uma solicitação de reunião só é criada após aprovação explícita na interface, e o Gabriel confirma por e-mail. Convites não são enviados pelo Google: os e-mails ficam só na descrição do evento, então o agente não serve para spam a terceiros.

## Modelo de ameaças

| Ator | Objetivo | Camadas que barram |
|---|---|---|
| Visitante malicioso | Forjar histórico ou aprovação, spam no calendário | Histórico do servidor, aprovação validada, tools no servidor, política de reunião, calendário dedicado |
| Bot de custo | Queimar tokens Gemini/Cohere | Rate limit, orçamento de tokens, lock por chat, limites do modelo |
| Leitor de chat público | XSS armazenado, UI falsa | Sanitização da saída (Comark), CSP `frame-ancestors` |
| Site de terceiros | CSRF ou clickjacking no botão de aprovar | `nuxt-csurf`, `frame-ancestors` |
| Conteúdo recuperado pelo RAG | Injeção indireta de instruções | Regras de segurança no prompt, saídas de tools truncadas |

## Camadas

| Camada | O que faz | Onde |
|---|---|---|
| Borda | CSRF em POST/PUT/PATCH/DELETE, headers de segurança, `frame-ancestors`, limite de corpo (32 KB) | `nuxt.config.ts`, `server/utils/security.ts` |
| Identidade e cotas | Rate limit por sessão e por IP, lock de um stream por chat, kill switch | `server/utils/rate-limit.ts`, `server/utils/chat-availability.ts` |
| Integridade da entrada | Corpo aceita só uma mensagem de usuário (texto) ou decisões de aprovação; histórico vem do banco; aprovação precisa casar `approvalId` e `toolCallId` com uma solicitação pendente gravada | `server/utils/chat/history.ts`, `server/api/(chat)/chats/[id].post.ts` |
| Modelo | Prompt com regras de segurança, `maxOutputTokens`, timeouts, `maxRetries`, orçamento de tokens, abort ao fechar a aba, `safetySettings` | `server/utils/chat/prompt.ts`, `server/utils/chat-budget.ts` |
| Tools | Execução direta no servidor (sem endpoints públicos), política de reunião, reserva atômica de 1 reunião por chat, cotas diárias, erros genéricos para o modelo | `server/utils/chat/tools.ts`, `server/utils/calendar/{policy,meeting}.ts` |
| Saída | Comark com `html: false`, plugin `security` e allowlist de tags; links só `https`/`mailto`; sem imagens | `app/components/chat/Comark.ts`, `app/utils/ai/comark-allowlist.ts`, `ProseA.vue`, `SourceLink.vue` |
| Dados | Chat público oculta reasoning, cartões de agenda e reunião, e mascara e-mails; logs sem texto do visitante | `server/utils/chat/redact.ts`, `server/utils/search.ts` |
| Observabilidade | Eventos `security` no log, contadores no Redis, testes | `server/utils/security.ts`, `server/plugins/security-log.ts`, `test/unit` |

## Limites

Os valores ficam em `shared/utils/constants/chat.constants.ts` (`ABUSE_LIMITS`, `CHAT_LIMITS`, `MEETING_POLICY`).

| Recurso | Limite |
|---|---|
| Mensagens por sessão | 20 por hora e 60 por dia |
| Mensagens por IP | 40 por hora e 120 por dia |
| Novos chats | 5 por hora por sessão e 10 por hora por IP |
| Tokens | 150 mil por sessão e 300 mil por IP a cada 24 h |
| Tokens globais | 2 milhões a cada 24 h; acima disso o chat é desligado até a janela expirar |
| Tokens por requisição | 40 mil (o stream é abortado) |
| Reuniões | 1 por chat, 2 por sessão por dia, 5 no total por dia |
| Mensagem | 4.000 caracteres e corpo de 32 KB |
| Agendamento | Exatamente 60 min, com 45 min de antecedência no mínimo e 60 dias no máximo, dentro do expediente |

Se o Redis ficar indisponível, as cotas passam a valer por instância, em memória e com metade dos limites. O evento `ratelimit-degraded` aparece no log.

## Configuração de produção

| Variável | Uso |
|---|---|
| `NUXT_CSURF_ENCRYPT_SECRET` | Obrigatória. Exatamente 32 caracteres ASCII (`openssl rand -base64 22`). Sem ela o segredo é sorteado no build e os tokens quebram a cada deploy. |
| `NUXT_REDIS_URL` | Cotas, locks, orçamento e kill switch (e as filas BullMQ). |
| `NUXT_GOOGLE_CALENDAR_ID` | Calendário **dedicado** onde o agente escreve as solicitações. |
| `NUXT_GOOGLE_AVAILABILITY_CALENDAR_ID` | Calendário principal, lido só como livre/ocupado. Opcional. |
| `NUXT_CHAT_ENABLED`, `NUXT_CHAT_SCHEDULING_ENABLED` | Kill switches que exigem redeploy (`true` por padrão). |
| `NUXT_GEMINI_API_KEY`, `NUXT_COHERE_API_KEY`, `NUXT_GOOGLE_CLIENT_EMAIL`, `NUXT_GOOGLE_PRIVATE_KEY`, `NUXT_DATABASE_URL`, `NUXT_SESSION_PASSWORD` | Já existentes. |

Para testar um build de produção em `http://localhost` (`bun run preview`), use `NITRO_CSURF_HTTPS=false` e `NITRO_CSURF_COOKIE_KEY=csrf`.

### Calendário dedicado

1. No Google Calendar, crie o calendário "Solicitações do agente".
2. Compartilhe-o com o e-mail da service account com a permissão "Fazer alterações nos eventos".
3. No calendário principal, reduza a permissão da service account para "Ver apenas livre/ocupado (ocultar detalhes)".
4. Defina `NUXT_GOOGLE_CALENDAR_ID` com o id do calendário dedicado e `NUXT_GOOGLE_AVAILABILITY_CALENDAR_ID` com o do principal.

A disponibilidade considera os dois calendários, então uma solicitação pendente bloqueia o horário. Os escopos OAuth são `calendar.events`, `calendar.events.freebusy` e `calendar.freebusy`; o `calendar.readonly` foi removido.

## Runbook

**Desligar o chat imediatamente (sem redeploy):**

```
redis-cli -u "$NUXT_REDIS_URL" SET sec:chat:disabled 1 EX 86400
```

**Desligar só o agendamento:**

```
redis-cli -u "$NUXT_REDIS_URL" SET sec:chat:scheduling-disabled 1 EX 86400
```

Para religar, apague a chave (`DEL`). Para um desligamento permanente, use `NUXT_CHAT_ENABLED=false` ou `NUXT_CHAT_SCHEDULING_ENABLED=false` e faça redeploy.

**Investigar abuso:** filtre os logs pela tag `security`. Os eventos são `ratelimit`, `ratelimit-degraded`, `payload-too-large`, `history-invalid`, `approval-invalid`, `regenerate-invalid`, `message-conflict`, `concurrent-stream`, `budget-exceeded`, `chat-disabled`, `meeting-policy`, `meeting-limit`, `tool-error` e `csrf`. Sessões e IPs aparecem como hash curto, nunca em claro.

**Rotacionar chaves:** troque a chave no provedor, atualize a variável na Vercel e faça redeploy. Trocar `NUXT_SESSION_PASSWORD` desloga todo mundo e cria novas sessões anônimas. Trocar `NUXT_CSURF_ENCRYPT_SECRET` invalida os tokens das páginas abertas, e os visitantes precisam recarregar.

**Zerar cotas de um teste:** as chaves de segurança usam o prefixo `sec:`. Apague só as chaves do teste, nunca o prefixo inteiro em produção.

## Testes

```
bun run test
```

Os testes unitários (`test/unit`) cobrem o schema do corpo, a mescla de histórico e aprovações, a política de reunião, o truncamento do RAG, o mascaramento do chat público, o limitador em memória, o mapeamento de erros do cliente e a sanitização do markdown com o parser real do Comark. Eles rodam no CI.

## Pendências

- CSP completo com nonce (avaliar `nuxt-security`); hoje só `frame-ancestors` é aplicado.
- Retenção de chats anônimos (apagar conversas inativas após N dias).
- Rodar o typecheck do servidor no CI (`vue-tsc --noEmit -p .nuxt/tsconfig.server.json`); o script `typecheck` cobre só `app` e `shared`.
- O expediente (08:00 às 20:00) é comparado no fuso do visitante, como `getBusyFree` já fazia. Avaliar se deveria ser o fuso do Gabriel.
- A skill `.agents/skills/ai-sdk` documenta a AI SDK v7, mas o projeto usa a v6.

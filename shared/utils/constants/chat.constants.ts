/**
 * @fileoverview Constantes de domínio para o chatbot, ferramentas do agente,
 * regras de calendário e busca híbrida de conteúdo.
 * Segue o padrão de imutabilidade com `as const` e tipagem estrita do TypeScript.
 */

// ============================================================================
// 1. CHAT ROLES & FERRAMENTAS DO AGENTE
// ============================================================================

/**
 * Papéis suportados nas mensagens do chat.
 */
export const CHAT_ROLE = {
  user: 'user',
  assistant: 'assistant',
  system: 'system',
} as const

/** Lista de papéis válidos para uso com validadores e schemas Zod. */
export const CHAT_ROLES_ARRAY = Object.values(CHAT_ROLE)

/** Tipo inferido representando os papéis de mensagem do chat. */
export type ChatRole = (typeof CHAT_ROLE)[keyof typeof CHAT_ROLE]

/**
 * Nomes de identificação de todas as ferramentas disponíveis para o agente de IA.
 */
export const CHAT_TOOL = {
  calculateDate: 'calculateDate',
  getWeekday: 'getWeekday',
  calendar: 'calendar',
  createMeeting: 'createMeeting',
  searchContent: 'searchContent',
  adjacentContent: 'adjacentContent',
} as const

/** Lista de nomes de ferramentas para validação e checagem de tipos. */
export const CHAT_TOOLS_ARRAY = Object.values(CHAT_TOOL)

/** Tipo literal inferido com os identificadores das ferramentas do agente. */
export type ChatToolName = (typeof CHAT_TOOL)[keyof typeof CHAT_TOOL]

// ============================================================================
// 2. CONFIGURAÇÕES DE AGENDAMENTO E GOOGLE CALENDAR
// ============================================================================

/**
 * Regras de negócio e restrições temporais para reuniões e consultas de disponibilidade.
 */
export const CALENDAR_CONFIG = {
  /** Antecedência mínima permitida para marcar reuniões (em minutos). */
  minAdvanceMinutes: 45,
  /** Duração padrão assumida para novos agendamentos (em minutos). */
  defaultMeetingDurationMinutes: 60,
  /** Início do horário comercial de atendimento (HH:mm:ss). */
  workHoursStart: '08:00:00',
  /** Fim do horário comercial de atendimento (HH:mm:ss). */
  workHoursEnd: '20:00:00',
  /** Fuso horário padrão de referência de Gabriel Serejo. */
  defaultTimeZone: 'America/Sao_Paulo',
} as const

// ============================================================================
// 3. BUSCA DE CONTEÚDO E RECIPROCAL RANK FUSION (RRF)
// ============================================================================

/**
 * Direções possíveis para expansão de chunks adjacentes de leitura.
 */
export const SEARCH_DIRECTION = {
  both: 'both',
  previous: 'previous',
  next: 'next',
} as const

/** Lista das direções de busca suportadas. */
export const SEARCH_DIRECTIONS_ARRAY = Object.values(SEARCH_DIRECTION)

/** Direção de adjacência padrão. */
export const DEFAULT_SEARCH_DIRECTION = SEARCH_DIRECTION.both

/** Tipo inferido para direção de busca adjacente. */
export type SearchDirection = (typeof SEARCH_DIRECTION)[keyof typeof SEARCH_DIRECTION]

/**
 * Parâmetros padrão e limites do algoritmo de busca híbrida.
 */
export const SEARCH_CONFIG = {
  /** Quantidade padrão de resultados relevantes retornados. */
  defaultLimit: 20,
  /** Limite máximo de chunks por consulta. */
  maxLimit: 20,
  /** Constante k do Reciprocal Rank Fusion (RRF) para balanceamento entre vetor e BM25. */
  defaultRrfK: 60,
  /** Quantidade padrão de chunks adjacentes em cada direção. */
  defaultAdjacentLimit: 2,
  /** Quantidade máxima de chunks vizinhos permitidos por direção. */
  maxAdjacentLimit: 10,
} as const

// ============================================================================
// 4. UNIDADES TEMPORAIS E DIAS DA SEMANA
// ============================================================================

/**
 * Unidades temporais suportadas pela ferramenta de cálculo de datas.
 */
export const DATE_UNIT = {
  days: 'days',
  weeks: 'weeks',
  months: 'months',
  years: 'years',
} as const

/** Lista de unidades temporais para schemas Zod. */
export const DATE_UNITS_ARRAY = Object.values(DATE_UNIT)

/** Unidade temporal padrão. */
export const DEFAULT_DATE_UNIT = DATE_UNIT.days

/** Tipo inferido das unidades de cálculo temporal. */
export type DateUnit = (typeof DATE_UNIT)[keyof typeof DATE_UNIT]

/**
 * Ocorrências suportadas para resolução de dias da semana.
 */
export const WEEKDAY_OCCURRENCE = {
  next: 'next',
  previous: 'previous',
  thisWeek: 'this_week',
} as const

/** Lista de ocorrências suportadas para schemas Zod. */
export const WEEKDAY_OCCURRENCES_ARRAY = Object.values(WEEKDAY_OCCURRENCE)

/** Ocorrência de dia da semana padrão. */
export const DEFAULT_WEEKDAY_OCCURRENCE = WEEKDAY_OCCURRENCE.next

/** Tipo inferido para ocorrência de dia da semana. */
export type WeekdayOccurrence = (typeof WEEKDAY_OCCURRENCE)[keyof typeof WEEKDAY_OCCURRENCE]

/**
 * Dias da semana em inglês compatíveis com mapeamentos de bibliotecas de data.
 */
export const DAY_OF_WEEK = {
  sunday: 'sunday',
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
} as const

/** Lista de dias da semana para schemas Zod. */
export const DAYS_OF_WEEK_ARRAY = Object.values(DAY_OF_WEEK)

/** Tipo inferido dos dias da semana. */
export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK]

// ============================================================================
// 5. LIMITES DE ABUSO E CUSTO (DEFESA EM PROFUNDIDADE)
// ============================================================================

const HOUR = 60 * 60
const DAY = 24 * HOUR

/**
 * Cotas por sessão, por IP e globais aplicadas pelo servidor (Redis, com fallback em memória).
 * Os valores são iniciais e devem ser ajustados com base nos logs `security:ratelimit`.
 */
export const ABUSE_LIMITS = {
  messages: {
    session: [
      { limit: 20, windowSec: HOUR },
      { limit: 60, windowSec: DAY },
    ],
    ip: [
      { limit: 40, windowSec: HOUR },
      { limit: 120, windowSec: DAY },
    ],
  },
  chats: {
    session: [{ limit: 5, windowSec: HOUR }],
    ip: [{ limit: 10, windowSec: HOUR }],
  },
  tokens: {
    /** Tokens (entrada + saída) por janela de 24h */
    session: 150_000,
    ip: 300_000,
    /** Acima deste total global o chat é desligado até a janela expirar */
    global: 2_000_000,
    /** Teto por requisição: o stream é abortado ao ultrapassar */
    perRequest: 40_000,
    windowSec: DAY,
  },
  meetings: {
    perSessionPerDay: 2,
    globalPerDay: 5,
    /** Reserva de 1 reunião por chat */
    perChatTtlSec: 30 * DAY,
  },
  /** Duração máxima de um stream antes de o lock do chat expirar */
  chatLockMs: 120_000,
} as const

/**
 * Limites de tamanho e de execução do agente.
 */
export const CHAT_LIMITS = {
  maxBodyBytes: 32 * 1024,
  maxMessageChars: 4000,
  maxTextPartsPerMessage: 4,
  maxIdLength: 64,
  maxApprovalsPerRequest: 3,
  /** Mensagens do histórico enviadas ao modelo */
  historyWindow: 30,
  maxSteps: 5,
  maxOutputTokens: 2048,
  titleInputChars: 500,
  streamTotalTimeoutMs: 90_000,
  streamChunkTimeoutMs: 20_000,
  /** Conteúdo de RAG devolvido ao modelo */
  maxChunkChars: 1500,
  maxToolResultChars: 8000,
} as const

/**
 * Regras de agendamento revalidadas no servidor, independentemente do modelo.
 */
export const MEETING_POLICY = {
  /** Horizonte máximo para solicitar reuniões (em dias). */
  maxDaysAhead: 60,
  maxAttendees: 1,
  maxSummaryChars: 120,
  maxDescriptionChars: 1000,
} as const

// ============================================================================
// 6. QUICK CHAT PROMPTS
// ============================================================================

export const QUICK_CHATS = [
  {
    /** Chave i18n usada como rótulo e como texto do prompt enviado */
    key: 'chat.quick.schedule_meeting',
    icon: 'i-lucide-calendar',
  },
] as const

// ============================================================================
// 7. SHARED CONVERSATIONS
// ============================================================================

/** Query parameter that opens the chat popup on a conversation: `/?chat=<id>` (the `/chat` pages were removed) */
export const CHAT_SHARE_QUERY = 'chat'

/** Chat ids accepted from links: the server generates UUIDs, the length cap is the one the API validates */
export const CHAT_ID_PATTERN = new RegExp(`^[\\w-]{1,${CHAT_LIMITS.maxIdLength}}$`)

---
title: "Desenvolvedor Full-Stack Sênior / Engenheiro de IA Generativa"
org: "Implanta IT Solutions"
image: '/experience/experience-implanta.webp'
location: "Goiânia, GO"
start: 2024-05-02
end: 2026-11-30
delivered:
  - "Integro agentes de IA e pipelines de RAG a sistemas corporativos existentes em Node.js, TypeScript e Python, sem precisar reescrever o código legado ao redor deles."
  - "Em um hackathon interno, criei o Atlas, um chatbot que centraliza as regras de negócio da empresa. A ideia era não ter que pagar US$ 50 por usuário/mês em licenças do NotebookLM. O projeto venceu a competição e virou um produto comercial. Arquitetura: BFF em Node.js, LangGraph, LangChain e Vercel AI SDK com Amazon Bedrock. Combinei busca híbrida (BM25 + pgvector com índice HNSW) com reranking semântico e cheguei a 98,9% de Recall@5 no conjunto de avaliação interno."
  - "Desenvolvi o cliente MCP do Atlas e servidores MCP próprios que leem os bancos de dados relacionais dos clientes, com uma camada de anonimização bidirecional em tempo real (Microsoft Presidio e GLiNER) que remove PII antes que qualquer dado chegue aos modelos."
  - "Montei o pipeline de testes e telemetria dos LLMs com OpenTelemetry, Datadog, LangSmith e DeepEval. Acompanho métricas de grounding, Recall@K e Precision@K vinculadas às tags de commit do Git para detectar regressões de prompt e drift de modelo antes do deploy."
  - "Construí o Cockpit 2.0, uma engine em TypeScript que monta as telas do frontend dinamicamente a partir do que a API retorna. Usei DDD, SOLID, ports and adapters e inversão de dependência para desacoplar os módulos. Assim, os microsserviços podem mudar sem um novo deploy da interface."
  - "Tirei o processamento pesado de documentos da rota principal da API e passei para filas com Redis e BullMQ, além de configurar prompt caching para o contexto dos documentos. Com isso, o chat continuou rápido e o consumo de tokens caiu."
---

Na Implanta, fui incumbido de um dos maiores desafios da minha carreira. Com 20 anos de mercado, a empresa já está consolidada, e eu aceitei a missão de, junto dos meus amigos do time Sépia, reconstruir a ferramenta que é o pilar central do negócio Implanta: o Cockpit 2.0.

Essa plataforma é o cérebro da visibilidade da distribuição. É através dela que acontece todo o processo de extração, integração e tratamento de dados para a parte de analytics, incluindo funcionalidades cruciais como previsão de stockout, previsão de sellout e o cubo de vendas.

O grande ponto de virada foi a arquitetura que desenhei para as interfaces. Em vez de criar dezenas de versões do mesmo software, desenvolvi um núcleo de renderização que se adapta dinamicamente. Na prática, a própria API define a estrutura, os formulários e as interações de cada tela, de forma modular.

Essa abordagem foi estratégica por um motivo crucial: nosso time era majoritariamente composto por especialistas em backend. Com essa arquitetura, eles ganharam autonomia para construir e modificar as telas diretamente via API, sem depender de um ciclo de desenvolvimento frontend para cada ajuste.

Atuando como o principal arquiteto dessa frente, a ferramenta conseguiu destravar a produtividade da equipe e garantir que o projeto avançasse em um ritmo acelerado, mesmo com um time enxuto. O resultado foi um produto robusto, escalável e altamente personalizável, entregue com uma velocidade que só foi possível graças a essa sinergia. Nada disso seria possível, sem a confiança de nosso CTO, Allan Menezes e sua determinação em oferecer a melhor ferramenta que um cliente pode receber.

- Idiomas: Python, JavaScript, TypeScript, Node.js

- Banco de Dados: PostgreSQL, pgvector, Pinecone, Weaviate, Chroma

- Frameworks e Arquitetura: FastAPI, Flask, Django, Vue.js (Vue 2/3), Nuxt (2/3), Micro-Frontends, Clean Architecture, SWR, Hexagonal Architecture

- Nuvem e DevOps: GCP, Azure AI Services, Docker, Kubernetes, Terraform, Bicep, CloudFormation, GitHub Actions, GitLab CI, Azure DevOps

- Metodologias: Agile / Scrum

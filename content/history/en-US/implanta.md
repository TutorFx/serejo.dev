---
title: "Senior Full-Stack Developer / Generative AI Engineer"
org: "Implanta IT Solutions"
image: '/experience/experience-implanta.webp'
location: "Goiânia, Brazil"
start: 2024-05-02
end: 2026-11-30
delivered:
  - "Integrate AI agents and RAG pipelines into existing enterprise systems in Node.js, TypeScript, and Python, without having to rewrite the legacy code around them."
  - "Created Atlas, a chatbot that centralizes the company's business rules, at an internal hackathon to avoid paying US$50 per user per month for NotebookLM licenses. The project won the competition and became a commercial product. Architecture: Node.js BFF, LangGraph, LangChain, and Vercel AI SDK with Amazon Bedrock. Combined hybrid search (BM25 + pgvector with an HNSW index) with semantic reranking and reached 98.9% Recall@5 on the internal evaluation set."
  - "Developed the Atlas MCP client and in-house MCP servers that read customers' relational databases, with a real-time bidirectional anonymization layer (Microsoft Presidio and GLiNER) that removes PII before anything is sent to the models."
  - "Set up the LLM testing and telemetry pipeline with OpenTelemetry, Datadog, LangSmith, and DeepEval. Track grounding, Recall@K, and Precision@K metrics tied to Git commit tags to catch prompt regressions and model drift before deploy."
  - "Built Cockpit 2.0, a TypeScript engine that assembles screens dynamically on the frontend from what the API returns. Used DDD, SOLID, ports and adapters, and dependency inversion to decouple the modules and let the microservices change without a new UI deploy."
  - "Moved heavy document processing off the main API route onto Redis and BullMQ queues and set up prompt caching for the document context, which kept the chat fast and cut token usage."
---

At Implanta, I was entrusted with one of the biggest challenges of my career. With 20 years in the market, the company is already well-established, and I accepted the mission, alongside my friends from the Sépia team, to rebuild the tool that is the central pillar of the Implanta business: Cockpit 2.0.

This platform is the brain of distribution visibility. It is through it that the entire process of data extraction, integration, and processing for the analytics side takes place, including crucial functionalities such as stockout prediction, sellout forecasting, and the sales cube.

The major turning point was the architecture I designed for the interfaces. Instead of creating dozens of versions of the same software, I developed a rendering core that adapts dynamically. In practice, the API itself defines the structure, forms, and interactions of each screen in a modular way.

This approach was strategic for a crucial reason: our team was mostly composed of backend specialists. With this architecture, they gained the autonomy to build and modify screens directly via the API, without depending on a frontend development cycle for each adjustment.

Acting as the main architect of this front, the tool managed to unlock the team's productivity and ensure that the project advanced at an accelerated pace, even with a lean team. The result was a robust, scalable, and highly customizable product, delivered with a speed that was only possible thanks to this synergy. None of this would have been possible without the trust of our CTO, Allan Menezes, and his determination to offer the best tool a client can receive.

- Languages: Python, JavaScript, TypeScript, Node.js

- Databases: PostgreSQL, pgvector, Pinecone, Weaviate, Chroma

- Frameworks & Architecture: FastAPI, Flask, Django, Vue.js (Vue 2/3), Nuxt (2/3), Micro-Frontends, Clean Architecture, SWR, Hexagonal Architecture

- Cloud & DevOps: GCP, Azure AI Services, Docker, Kubernetes, Terraform, Bicep, CloudFormation, GitHub Actions, GitLab CI, Azure DevOps

- Methodology: Agile / Scrum

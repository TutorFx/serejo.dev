---
title: Atlas
url: https://atlas.implantait.com/
---

O projeto Atlas surgiu em um hackathon. E com o passar do tempo, se tornou o grande projeto da minha carreira. O objetivo era conseguir utilizar funcionalidades semelhantes ao NotebookLM, mas a companhia tem sérias restrições de compliance, e 50 dólares por assento não era nada agradável. Inicialmente, o projeto fluiu bem. Consegui desenvolver em apenas sete dias todo o gerenciamento de acessos ACL e consegui reaproveitar a parte do frontend de um projeto feito pela Nuxt Labs e isso encurtou muito o processo de validação da ideia. 

Vencemos em primeiro lugar entre os hackatons, e eu fui o único desenvolvedor envolvido. Mas após essa primeira validação, o projeto ainda passou por muitas etapas. Uma coisa é validar uma ideia em um ambiente controlado, e outra coisa é o ambiente de produção. Nessas primeiras etapas, nós ainda estávamos testando modelos open-weights e após a mudança do qwen-2.5:7b para o qwen-3.5:7b, resultou em resultados em texto que alucinaram em chinês. E foi aí que surgiu a ideia de implementar observabilidade com o Langfuse. Porém, pela questão de compliance, o Langfuse foi descontinuado logo após desenvolvermos nosso próprio sistema de telemetria. Eu tive como testar formas de melhorar o NaiveRAG que usávamos na época, e foi aí que eu fiquei sabendo mais sobre outras arquiteturas. A minha primeira tentativa, foi a que tinha a maior assertividade mas ela tinha um problema muito sério de uso de tokens e resposta muito demorada (que é o GraphRag). Após ver as métricas no na telemetria, eu acabei revertendo essa nova arquitetura e migrei para Contextual Chunking Reciprocal Rank Fusion em BM25 (Contextual retrieval), que graças ao pré-processamento dos documentos para adicionar contexto, o tempo de inferência reduziu de em 20 segundos do GraphRag, e ainda manteve a consistência das respostas. 

Para guardrails, inicialmente, eu testei modelos menores finetunados especificamente para isso, porém eu obtive muitos falsos positivos e negativos. E então acabou que eu usei o mesmo modelo com outro prompt para avaliar, anotar e encerrar streams quando necessário. Modelos pequenos são bons com pequenos contextos, mas ainda assim eu notei alguma alucinação em menos de 1% das conversas que analisei. Acontece que só o contextual retrieval ainda não é o suficiente, e então eu fiz uma mistura do mesmo com o SelfRag, que dá abertura para o modelo visualizar os chunks adjacentes.

À medida que o projeto foi avançando para os estágios finais, surgiu a necessidade de utilizar modelos de fronteira para suportar janelas de contexto massivas via MCP, visto que nossos clientes usam outros produtos dentro da empresa, e esses produtos não tinham integração com o Atlas até então. Só que o problema é que por compliance nós não podemos entregar informação sensível para um provedor externo de IA. Acontece que eu já vinha me preparando para quando esse momento chegasse desde o hackathon.

Para anonimizar as PIIs, eu utilizei o Microsoft Presidio Analyser e criei uma camada de anonimização em todo o state da conversa e das ferramentas, assim, o agente repassa apenas entidades como <|%PERSON_1%|> para o modelo externo. E da mesma forma, o stream é recebido por essa mesma camada e desanonimizado antes de chegar ao client.

Já para a parte dos MCPs, eu criei uma tabela no banco com pivô da aplicação (o pg-vector) para conseguir usar o mesmo MCP em grupos diferentes.

Outra funcionalidade bacana referente ao retrieval foi que eu consegui trazer também conteúdos restritos apenas para informar ao usuário que o servidor possui a informação que ele procura, mas que está em outro grupo. Essa funcionalidade foi feita de forma totalmente determinística e segura. 

Para validar o client MCP, eu criei um pequeno server com cerca de 20 relatórios diferentes com dados totalmente anonimizados e consegui fazer uma demonstração dos dados de entrada e saída na etapa de anonimização antes de demonstrar essa nova capacidade aos clientes. Eu fiz isso porque nenhum cliente gostaria de ter seus dados usados como cobaia de testes.

A etapa atual do projeto, é de homologação 2 multi-nacionais, e já temos vários cases de sucesso por parte dos clientes.

Hoje o projeto é liderado por mim (Gabriel Serejo) e tem três outros engenheiros de software trabalhando sob minha tutela.

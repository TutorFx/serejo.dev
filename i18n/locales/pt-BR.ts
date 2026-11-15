export default defineI18nLocale(() => {
  return {
    menu: {
      home: 'Início',
      about: 'Sobre mim',
      history: 'Trajetória',
      projects: 'Projetos',
      blog: 'Blog',
    },
    meta: {
      home: {
        path: '/inicio',
        title: 'Início',
        description:
          'Desenvolvimento web de alta qualidade para projetos novos e legados. Entre em contato com Gabriel Serejo hoje mesmo!',
        keywords:
          'Desenvolvimento web, projetos novos, projetos legados, soluções personalizadas, alta qualidade, Gabriel Serejo, Engenheiro de IA, Full Stack',
        summary:
          'Portfólio pessoal de Gabriel Serejo, Engenheiro de IA Generativa & Full Stack com 8+ anos de experiência. Apresentação inicial (Hero), atuação internacional, arsenal de tecnologias (stack) e destaques de experiências profissionais.',
      },
      history: {
        path: '/minha-jornada',
        title: 'Histórico de trabalhos',
        description:
          'Desenvolvedor web experiente com histórico comprovado em projetos internacionais e paixão por transformar ideias em realidade. Habilidade em diversas tecnologias, incluindo Vue, Nuxt e JavaScript. Entusiasta de código aberto e pronto para novos desafios.',
        keywords:
          'Desenvolvedor Web, Front-end, Vue, Nuxt, JavaScript, Arquitetura Hexagonal, Camadas de Serviço, Vuetify, WordPress, Projetos Legados, Desenvolvimento de Sites, Landing Pages, Internacional, Portugal, Brasil, Histórico Profissional',
        summary:
          'Trajetória profissional completa e linha do tempo de carreira de Gabriel Serejo. Histórico detalhado de empresas (Implanta IT Solutions, TLScontact, Cliqx, UniFAJ, Agência Industrial), cargos, entregas e migrações arquiteturais.',
      },
      projects: {
        path: '/projetos',
        title: 'Projetos',
        description:
          'Gabriel Serejo Dev: Trajetória profissional e projetos. Experiências em desenvolvimento front-end e implementação de recursos.',
        keywords:
          'Gabriel Serejo, Desenvolvedor Web, Desenvolvedor Front-end, Implementação de Recursos, Projetos Web, Trajetória Profissional, Experiência, Portfólio, Código Aberto, Projetos de IA',
        summary:
          'Vitrine de projetos de engenharia de software e inteligência artificial desenvolvidos por Gabriel Serejo, incluindo aplicações web, bibliotecas open source, ferramentas e demonstrações técnicas.',
      },
      blog: {
        path: '/blog',
        title: 'Blog',
        description:
          'Artigos técnicos, tutoriais e reflexões sobre Desenvolvimento Web, IA Generativa, Nuxt, Vue, TypeScript, Agentes de IA e Arquitetura de Software por Gabriel Serejo.',
        keywords:
          'Blog, Desenvolvedor Web, Front-end, Vue, Nuxt, JavaScript, TypeScript, IA Generativa, LLMs, Agentes de IA, RAG, Arquitetura, Artigos, Tutoriais',
        summary:
          'Blog técnico com listagem de artigos, tutoriais e análises de Gabriel Serejo sobre engenharia web moderna, integrações com IA, performance e boas práticas.',
      },
      resume: {
        path: '/resume',
        title: 'Currículo (Resume)',
        description:
          'Gabriel Serejo - Currículo de Engenheiro de IA Generativa e Full Stack. Resumo, competências técnicas, certificações e experiência de trabalho.',
        keywords:
          'Currículo, Resume, CV, Gabriel Serejo, Engenheiro de IA Generativa, Desenvolvedor Full Stack, Habilidades, Certificações, Histórico Profissional',
        summary:
          'Currículo digital e para impressão de Gabriel Serejo. Apresenta resumo do perfil, competências técnicas (Python, TypeScript, Vue/Nuxt, LangChain, RAG, pgvector), certificações em IA e principais projetos da carreira.',
      },
      curriculum: {
        path: '/curriculum',
        title: 'Curriculum Vitae',
        description:
          'Gabriel Serejo - Curriculum Vitae. Visão abrangente de experiência profissional, formação acadêmica, certificações e competências.',
        keywords:
          'Curriculum Vitae, CV, Gabriel Serejo, Engenheiro de IA, Desenvolvedor Full Stack, Educação, Experiência, Certificações',
        summary:
          'Curriculum Vitae (CV) completo de Gabriel Serejo detalhando histórico profissional integral, formação acadêmica, certificações e competências técnicas em engenharia de software e IA.',
      },
    },
    SCHEDULE_support_text:
      'Sou Gabriel Serejo. Desenvolvo software há mais de 6 anos, os 2 últimos colocando agentes e RAG em produção em sistemas que já existiam.',
    SCHEDULE_cta: 'Agendar conversa',
    description: 'Descrição',
    see_more: 'Ver mais',
    copyright: 'Todos os direitos reservados',
    footer: {
      privacy_policy: 'Políticas de privacidade',
      contact: 'Contato',
    },
    download_curriculum: 'Baixar currículo',
    curriculum: {
      summary: 'Resumo',
      profession: "Desenvolvedor Full-Stack Sênior {'|'} IA Agêntica e Generativa",
      work_experience: 'Experiência Profissional',
      education: 'Formação acadêmica',
      graduated_in: 'Conclusão: {date}',
      in_progress: 'Em progresso',
      technical_proficiencies: 'Habilidades técnicas',
      certifications_title: 'Certificações',
      professional_experience: 'Experiência profissional',
      skills: [
        {
          title: 'IA agêntica e LLMs',
          items:
            'Model Context Protocol (cliente e servidor MCP), sistemas multiagentes, LangGraph, LangChain, Vercel AI SDK, Amazon Bedrock, tool/function calling, prompt caching, padrões de prompt e raciocínio (ReAct, CoT, ToT)',
        },
        {
          title: 'Linguagens e frameworks',
          items:
            'Python (FastAPI, asyncio), TypeScript, Node.js, React, Next.js, Java (Spring Boot), SQL',
        },
        {
          title: 'Busca vetorial e dados',
          items:
            'busca híbrida contextual (BM25 + vetores densos), reciprocal rank fusion, pgvector (HNSW, IVFFlat), Redis, BullMQ, modelos de embedding, reranking semântico (bge-reranker)',
        },
        {
          title: 'Arquitetura e APIs',
          items:
            'microsserviços, arquitetura orientada a eventos, DDD, SOLID, ports and adapters (arquitetura hexagonal), inversão de dependência, REST, padrão BFF',
        },
        {
          title: 'Segurança, testes e observabilidade',
          items:
            "OpenTelemetry (OTel), Datadog, LangSmith, DeepEval, avaliação de documentos e de RAG (grounding, Recall{'@'}K, Precision{'@'}K), Microsoft Presidio e GLiNER (anonimização de PII), guardrails determinísticos, testes automatizados (pytest, Vitest)",
        },
        {
          title: 'Cloud, DevOps e infraestrutura',
          items:
            'AWS (Bedrock, ECS, S3, SES), Microsoft Azure, Terraform (IaC), Docker, pipelines de CI/CD, Git',
        },
      ],
      certifications: [
        'Oracle Agentic AI Foundations Associate (2026)',
        'Google AI Professional Certificate (2026)',
        'Oracle AI Vector Search Certified Professional (2025)',
      ],
    },
    active: 'Ativo',
    me: {
      summary:
        'Desenvolvedor full-stack sênior com mais de 6 anos de experiência, sendo 2 deles em sistemas de IA generativa, agentes e RAG em produção. No dia a dia, integro LLMs a sistemas que já estão no ar, principalmente com TypeScript, Python, Node.js e React. Boa parte do trabalho fica na camada de confiabilidade e engenharia em torno desses modelos: Model Context Protocol (MCP), busca híbrida no PostgreSQL (pgvector), validação determinística, observabilidade (OpenTelemetry e Datadog) e anonimização de dados pessoais (PII).',
      abroad: `Em **8 anos** de trajetória, trabalhei com uma ampla variedade de produtos. Transformando 
      idéias em códigos e construído aplicações pixel perfect. Minha jornada é baseada em 
      estudos constantes, para não só me adaptar a tecnologia,
      mas também para estabelecer padrões elevados no desenvolvimento das soluções.`,
      passion: `Minha paixão é preencher a lacuna entre a imaginação e a realidade!
      Respiro código e sonho em pixels. Sou um
      desenvolvedor web apaixonado por criar aplicações agradáveis e funcionais.`,
      stack: `Adoro trabalhar com tantos frameworks e bibliotecas incríveis! E para 
          o meu projeto ideal, eu definitivamente escolheria usar...`,
      legacy: `Embora projetos no início sejam empolgantes, também me sinto 
          confortável em lidar com bases de códigos já existentes. Sou hábil em modernizar sistemas construídos
          com tecnologias obsoletas, tais como Vue 2, Nuxt 2, algumas bibliotecas de 
          componentes, JavaScript puro, jQuery e muito mais. Então, traga seus projetos 
          legados - estou pronto para modernizá-los e otimizá-los!`,
      open_source: `Meu entusiasmo por software de código aberto, me leva a fazer 
          contribuições significativas durante meu tempo livre. Sinta-se à vontade para 
          dar uma olhada no meu github!`,
      years_old: 'Eu tenho {years} anos',
      live_in: 'Atualmente eu vivo no Brasil, em Goiânia - GO.',
    },
    hero: {
      fl: 'Dev Sênior',
      sl: 'Full-Stack',
      tl: 'e IA',
    },
    navigation: {
      menu: 'Menu',
      settings: 'Configurações',
      back: 'Voltar',
    },
    sections: {
      statement: {
        title: 'Declarações',
      },
      about_me: {
        title: 'O Arquiteto de Pixels',
        accent: 'Sobre mim',
      },
      stack: {
        title: 'Meu Arsenal de Desenvolvimento',
        accent: 'Tech Stack',
      },
      open_source: {
        title: `Eu ❤️ código aberto!`,
        accent: 'Open Source',
      },
      experiences: {
        title: 'Experiências',
        description: '',
      },
      projects: {
        title: 'Projetos',
      },
    },
    time: {
      the_moment: 'o momento',
      until_the: 'até',
      reading_time: 'Leitura de {time}',
    },
    settings: {
      dark_mode: 'Modo noturno',
      light_mode: 'Modo claro',
    },
    chat: {
      input_label: 'Digite sua mensagem...',
      reply_in_second: 'Típicamente responde em 1s',
      greeting: {
        hello: 'Olá',
        morning: 'Bom dia',
        afternoon: 'Boa tarde',
        evening: 'Boa noite',
        with_name: '{greeting}, {name}',
      },
      tool_calendar: {
        availability: 'Disponibilidade',
        loading: 'Consultando agenda...',
        error: 'Erro ao consultar a agenda, tente novamente.',
        free_slots: 'Horários Livres',
        busy_slots: 'Compromissos Agendados',
        no_slots: 'Nenhum horário livre encontrado para o horário comercial deste dia.',
        timezone_difference: 'Fuso horário diferente:',
      },
      tool_meet: {
        confirm: 'Confirmar Agendamento',
        description: 'Deseja agendar a seguinte reunião?',
        summary: 'Título:',
        start: 'Início:',
        end: 'Fim:',
        attendees: 'Convidados:',
        approve: 'Agendar Reunião',
        deny: 'Cancelar',
        scheduled: 'Solicitação Enviada!',
        next_step: 'Aguardando Confirmação',
        next_step_desc:
          'Gabriel avaliará a disponibilidade. Você receberá a confirmação oficial e o link da reunião no e-mail informado.',
        open_calendar: 'Abrir Agenda',
        loading: 'Agendando evento na agenda...',
        error: 'Erro ao agendar reunião, tente novamente.',
        denied_alert: 'Agendamento cancelado.',
        datetime: '{date} às {time}',
      },
      tool_search: {
        loading: 'Consultando acervo...',
        completed: 'Consultou o acervo',
        error: 'Erro ao consultar acervo',
        no_results: 'Nenhum trecho correspondente encontrado',
        results_count: '{count} resultado | {count} resultados',
        view_page: 'Abrir página',
        collections: {
          blog: 'Blog',
          education: 'Educação',
          history: 'Carreira',
          projects: 'Projetos',
          pages: 'Páginas',
          routes: 'Páginas & Rotas',
        },
      },
      history: {
        today: 'Hoje',
        yesterday: 'Ontem',
        last_week: 'Última semana',
        last_month: 'Último mês',
      },
      ui: {
        untitled: 'Sem título',
        recent_conversations: 'Conversas recentes',
        rename: 'Renomear',
        delete: 'Excluir',
        cancel: 'Cancelar',
        save: 'Salvar',
        chat_actions: 'Ações do chat',
        open_chat: 'Abrir o Serejo Chat',
        close_chat: 'Fechar o chat',
        back_to_list: 'Voltar para as conversas',
        unavailable_title: 'Conversa indisponível',
        unavailable_description: 'Ela pode ter sido excluída ou não estar mais compartilhada.',
        prompt_placeholder: 'Pergunte qualquer coisa ou agende uma reunião...',
        thinking: 'Pensando...',
        not_found: 'Chat não encontrado',
        vote_failed: 'Não foi possível salvar a avaliação',
        copy_response: 'Copiar resposta',
        good_response: 'Boa resposta',
        bad_response: 'Resposta ruim',
        searching_web: 'Pesquisando na web...',
        searched_web: 'Pesquisou na web',
        rename_title: 'Renomear chat',
        rename_description: 'Escolha um novo título para este chat.',
        rename_placeholder: 'Título do chat',
        rename_failed: 'Não foi possível renomear o chat',
        delete_title: 'Excluir chat',
        delete_description:
          'Tem certeza de que deseja excluir este chat? Isso não pode ser desfeito.',
        deleted_title: 'Chat excluído',
        deleted_description: 'Seu chat foi excluído',
        delete_failed: 'Não foi possível excluir o chat',
        share: 'Compartilhar chat',
        shared: 'Chat compartilhado',
        share_description_private: 'Só você pode ver este chat.',
        share_description_public: 'Qualquer pessoa com o link pode ver este chat.',
        keep_private: 'Manter privado',
        keep_private_description: 'Só você tem acesso',
        shared_option: 'Compartilhado',
        shared_option_description: 'Qualquer pessoa com o link pode ver',
        visibility_failed: 'Não foi possível atualizar a visibilidade',
        copy_link: 'Copiar link',
        copied: 'Copiado!',
        log_out: 'Sair',
        create_failed: 'Não foi possível iniciar a conversa',
      },
      errors: {
        rate_limited:
          'Você está enviando mensagens rápido demais. Aguarde um pouco e tente novamente.',
        budget_exceeded: 'Você atingiu o limite diário de uso do assistente. Volte amanhã.',
        chat_disabled:
          'O assistente está temporariamente indisponível. Tente novamente mais tarde.',
        chat_busy:
          'O assistente ainda está respondendo à mensagem anterior. Aguarde a resposta terminar.',
        payload_too_large: 'A mensagem é longa demais. Encurte o texto e tente novamente.',
        invalid_request:
          'Não foi possível processar esta mensagem. Recarregue a página e tente novamente.',
        approval_invalid: 'Esta solicitação não está mais pendente. Recarregue a página.',
        session_expired: 'Sua sessão expirou. Recarregue a página e tente novamente.',
        stream_error: 'O assistente não conseguiu responder agora. Tente novamente.',
        generic: 'Algo deu errado. Tente novamente.',
      },
      quick: {
        schedule_meeting: 'Agendar uma reunião com o Gabriel',
      },
    },
  }
})

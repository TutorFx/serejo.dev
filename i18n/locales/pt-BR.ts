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
        title: 'Início',
        description: 'Desenvolvimento web de alta qualidade para projetos novos e legados. Entre em contato com Gabriel Serejo. hoje mesmo!',
        keywords: 'Desenvolvimento web, projetos novos, projetos legados, soluções personalizadas, alta qualidade, Gabriel Serejo',
      },
      history: {
        title: 'Histórico de trabalhos',
        description: 'Desenvolvedor web experiente com histórico comprovado em projetos internacionais e paixão por transformar ideias em realidade. Habilidade em diversas tecnologias, incluindo Vue, Nuxt e JavaScript. Entusiasta de código aberto e pronto para novos desafios.',
        keywords: 'Desenvolvedor Web, Front-end, Vue, Nuxt, JavaScript, Arquitetura Hexagonal, Camadas de Serviço, Vuetify, WordPress, Projetos Legados, Desenvolvimento de Sites, Landing Pages, Internacional, Portugal, Brasil',
      },
      projects: {
        description: 'Gabriel Serejo Dev: Trajetória profissional e projetos. Experiências em desenvolvimento front-end e implementação de recursos.',
        keywords: 'Gabriel Serejo, Desenvolvedor Web, Desenvolvedor Front-end, Implementação de Recursos, Projetos Web, Trajetória Profissional, Experiência, Portfólio',
      },
      blog: {
        title: 'Blog',
        description: '',
        keywords: 'Web Developer, Front-end, Vue, Nuxt, JavaScript, Hexagonal Architecture, Service Layers, Vuetify, WordPress, Legacy Projects, Website Development, Landing Pages, International, Portugal, Brazil',
      },
    },
    SCHEDULE_support_text: `Olá! Sou Gabriel Serejo, desenvovedor full stack. Ajudo empresas no desenvolvimento de 
    software e aplicações web.`,
    SCHEDULE_cta: 'Agende uma chamada',
    description: 'Descrição',
    see_more: 'Ver mais',
    copyright: 'Todos os direitos reservados',
    download_curriculum: 'Baixar Curriculum',
    curriculum: {
      summary: 'Resumo',
      profession: 'Engenheiro de IA Generativa',
      objective_title: 'Objetivo',
      objective: 'Engenheiro de IA Generativa',
      work_experience: 'Experiência Profissional',
      education: 'Educação',
      graduated_in: 'Formado em {date}',
      in_progress: 'Em progresso',
      technical_proficiencies: 'Competências Técnicas',
      certifications_title: 'Certificações',
      professional_experience: 'Experiência Profissional',
      projects_title: 'Projetos',
      skills: [
        'IA Generativa',
        'RAG',
        'LLMs',
        'Agentes de IA',
        'MCP (Model Context Protocol)',
        'LangChain',
        'TypeScript',
        'Python',
        'PyTorch',
        'Engenharia de Prompt',
        'Bancos de Dados Vetoriais',
        'PLN (Processamento de Linguagem Natural)',
        'PII',
        'Hugging Face',
        'APIs de Modelos (OpenAI, Gemini, Anthropic)',
        'Modelos Auto-hospedados (Ollama, vLLM, Hugging Face)',
        'Plataformas em Nuvem (Azure, AWS, GCP)',
        'TensorFlow',
        'Deep Learning',
        'LangSmith',
        'LangFuse',
        'OTel',
        'Google ADK',
        'Ragas',
      ],
      certifications: [
        'Oracle Agentic AI Certified Foundations Associate (2026)',
        'Google AI Professional Certificate (2026)',
        'Oracle AI Vector Search Certified Professional (2026)',
      ],
      projects: [
        {
          title: 'Chatbot Atlas & Cockpit 2.0 (RAG & Busca Semântica)',
          org: 'Implanta IT Solutions',
          delivered: [
            'Desenvolvi o "Atlas", um chatbot RAG de nível de produção utilizando LangChain, Vercel AI SDK e pg-vector, unificando a documentação e acelerando o onboarding.',
            'Criei um sistema de referência cruzada semântica usando modelos de embedding para normalização automatizada de produtos via PLN.',
            'Projetei o "Cockpit 2.0", construindo um motor dinâmico de UI-from-API com TypeScript avançado que desacoplou o frontend dos lançamentos de recursos.',
          ],
        },
        {
          title: 'Chatbot de Suporte ao Cliente & Migração para Micro-Frontends Escaláveis',
          org: 'TLScontact',
          delivered: [
            'Atuei como desenvolvedor principal do chatbot oficial de suporte ao cliente, gerenciando a integração ponta a ponta dos fluxos de IA conversacional.',
            'Lidei com a migração para uma arquitetura de "Feature Services", estabelecendo a escalabilidade necessária para ferramentas de IA em tempo real.',
            'Supervisionei a segurança e entrega de recursos para ferramentas institucionais de vistos utilizando Vue 3 e Node.js.',
          ],
        },
        {
          title: 'Arquitetura de Aplicação de Varejo (Padrões de Alta Concorrência)',
          org: 'Cliqx',
          delivered: [
            'Gerenciei a infraestrutura em nuvem no Azure, provisionando e configurando instâncias de servidores para suportar aplicações de varejo de alta concorrência.',
            'Escalei a arquitetura front-end de uma grande aplicação de varejo (Pernambucanas) utilizando o padrão hexagonal orientado a serviços.',
            'Engenheirei uma camada de cache Redis/SWR de alto desempenho, fornecendo a base de baixa latência necessária para aplicações orientadas a dados de IA.',
            'Migrei fluxos legados para Nuxt 3, aumentando a capacidade de processamento do sistema e a velocidade de desenvolvimento da equipe.',
          ],
        },
        {
          title: 'Aplicação de Admissão de Estudantes',
          org: 'UniFAJ',
          delivered: [
            'Desenvolvi a interface de usuário ponta a ponta para a aplicação de admissão de estudantes, cobrindo todas as etapas críticas desde o registro inicial até a conclusão de exames e redações.',
            'Implementei novos recursos fundamentais e reestruturei o código legado, aplicando princípios de código limpo para aprimorar a manutenibilidade e a qualidade geral da aplicação.',
          ],
        },
        {
          title: 'Soluções Web & Integração de IA',
          org: 'Agência Industrial',
          delivered: [
            'Entreguei soluções web completas e integradas para múltiplos clientes, gerenciando todo o ciclo de vida do projeto, do design de UI/UX à implementação e implantação full-stack.',
            'Aprimorei projetos de clientes desenvolvendo e integrando soluções de IA de pequeno porte utilizando a API GPT-3 com Python e Node.js.',
          ],
        },
        {
          title: 'Refatoração de Aplicação Legada & Integração com CMS',
          org: 'ITH Pós Graduação',
          delivered: [
            'Liderai a refatoração completa da aplicação legada, projeto que melhorou diretamente as pontuações do Google Speed Insights e reduziu significativamente os custos de anúncios.',
            'Desenvolvi e lancei uma nova aplicação front-end utilizando Nuxt 2, integrada com o WordPress CMS da empresa para modernizar a experiência do usuário e a entrega de conteúdo.',
          ],
        },
      ],
    },
    active: 'Ativo',
    me: {
      summary: 'Engenheiro de IA Generativa com 2 anos de experiência especializada na construção de aplicações de LLM e RAG em produção, respaldado por 8+ anos em engenharia de software full-stack. Combino profunda expertise em sistemas backend, bancos de dados e frontend (Python, Node.js, Vue/Nuxt) com frameworks modernos de IA (LangChain, Bancos Vetoriais) para projetar e entregar sistemas inteligentes e escaláveis. Histórico comprovado de liderança em migrações arquiteturais e entrega de soluções de IA de alto impacto para o mercado internacional.',
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
      fl: 'Consultor &',
      sl: 'Desenvolvedor',
      tl: 'Experiente',
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
      talk_to_cat: 'Oi, sou Felina. A assistente virtual do Serejo. Me mande um oi, te responderei caso você seja digno.',
      tool_calendar: {
        availability: 'Disponibilidade',
        loading: 'Consultando agenda...',
        error: 'Erro ao consultar a agenda, tente novamente.',
        free_slots: 'Horários Livres',
        busy_slots: 'Compromissos Agendados',
        no_slots: 'Nenhum horário livre encontrado para o horário comercial deste dia.',
        timezone_difference: 'Fuso horário diferente:'
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
        next_step_desc: 'Gabriel avaliará a disponibilidade. Você receberá a confirmação oficial e o link da reunião no e-mail informado.',
        open_calendar: 'Abrir Agenda',
        loading: 'Agendando evento na agenda...',
        error: 'Erro ao agendar reunião, tente novamente.',
        denied_alert: 'Agendamento cancelado.'
      }
    },
  }
})

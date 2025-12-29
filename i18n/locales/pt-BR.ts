export default defineI18nLocale(async (/* locale */) => {
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
      summary: 'Sumário',
      profession: 'Programador Fullstack',
      work_experience: 'Experiência de trabalho',
      education: 'Educação',
      graduated_in: 'Formado em {date}',
      in_progress: 'Em progresso',
    },
    active: 'Ativo',
    me: {
      summary: 'Engenheiro de Software experiente em transição para IA Generativa. Histórico comprovado em arquitetura web (Vue/Nuxt) para projetos internacionais, agora focado em sistemas inteligentes. Liderei iniciativas de IA, incluindo ferramentas de análise semântica e chatbots. Pós-graduando em Inteligência Artificial e Computacional, busco unir engenharia sólida com IA de ponta para solucionar desafios complexos.',
      abroad: `Em **7 anos** de trajetória, trabalhei com uma ampla variedade de produtos. Transformando 
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
    },
  }
})

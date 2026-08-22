export default defineI18nLocale(() => {
  return {

    menu: {
      home: 'Home',
      about: 'About me',
      history: 'Trajectory',
      projects: 'Projects',
      blog: 'Blog',
    },
    meta: {
      home: {
        title: 'Home',
        description: 'High-quality web development for new and legacy projects. Contact Gabriel Serejo today!',
        keywords: 'Web development, new projects, legacy projects, custom solutions, high quality, Gabriel Serejo',
      },
      history: {
        title: 'Job history',
        description: 'Experienced web developer with a proven track record in international projects and a passion for turning ideas into reality. Skilled in various technologies including Vue, Nuxt and JavaScript. Open-source enthusiast and ready for new challenges.',
        keywords: 'Web Developer, Front-end, Vue, Nuxt, JavaScript, Hexagonal Architecture, Service Layers, Vuetify, WordPress, Legacy Projects, Website Development, Landing Pages, International, Portugal, Brazil',
      },
      projects: {
        description: 'Gabriel Serejo Dev: Professional journey and projects. Experiences in front-end development and feature implementation.',
        keywords: 'Gabriel Serejo, Web Developer, Front-end Developer, Feature Implementation, Web Projects, Professional Journey, Experience, Portfolio',
      },
      blog: {
        title: 'Blog',
        description: '',
        keywords: 'Web Developer, Front-end, Vue, Nuxt, JavaScript, Hexagonal Architecture, Service Layers, Vuetify, WordPress, Legacy Projects, Website Development, Landing Pages, International, Portugal, Brazil',
      },
    },
    SCHEDULE_support_text: `Hey! I am Gabriel, a web engineering consultant based in Brazil. 
        I help companies to build better web applications and to improve their knowledge, 
        workflows, and culture.`,
    SCHEDULE_cta: 'SCHEDULE a call',
    description: 'Description',
    see_more: 'See more',
    copyright: 'All rights reserved',
    curriculum: {
      profession: 'Generative AI Engineer',
      summary: 'Summary',
      objective_title: 'Objective',
      objective: 'Generative AI Engineer',
      work_experience: 'Work Experience',
      education: 'Education',
      graduated_in: 'Completed in {date}',
      in_progress: 'In Progress',
      technical_proficiencies: 'Technical Proficiencies',
      certifications_title: 'Certifications',
      professional_experience: 'Professional Experience',
      projects_title: 'Projects',
      skills: [
        'Generative AI',
        'RAG',
        'LLMs',
        'AI agents',
        'MCP (Model Context Protocol)',
        'LangChain',
        'TypeScript',
        'Python',
        'PyTorch',
        'Prompt Engineering',
        'Vector Databases',
        'NLP',
        'PII',
        'Hugging Face',
        'Model APIs (OpenAI, Gemini, Anthropic)',
        'Self-hosted Models (Ollama, vLLM, Hugging Face)',
        'Cloud Platforms (Azure, AWS, GCP)',
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
          title: 'Atlas Chatbot & Cockpit 2.0 (RAG & Semantic Search)',
          org: 'Implanta IT Solutions',
          delivered: [
            'I engineered "Atlas", a production-grade RAG chatbot using LangChain, Vercel AI SDK, and pg-vector that unified documentation and accelerated onboarding.',
            'I developed a semantic cross-reference system using embedding models for automated product normalization via NLP.',
            'I architected "Cockpit 2.0", designing a dynamic UI-from-API engine using advanced TypeScript that decoupled frontend from feature launches.',
          ],
        },
        {
          title: 'Customer Support Chatbot & Scalable Micro-Frontend Migration',
          org: 'TLScontact',
          delivered: [
            'I was the lead developer for the official customer support chatbot, managing end-to-end integration of conversational AI flows.',
            'I championed the migration to a "Feature Services" architecture, establishing the scalability required for real-time AI toolsets.',
            'I oversaw security and feature delivery for institutional visa tools using Vue 3 and Node.js.',
          ],
        },
        {
          title: 'Retail Application Architecture (High-Concurrency Patterns)',
          org: 'Cliqx',
          delivered: [
            'I managed cloud infrastructure on Azure, provisioning and configuring server instances to support high-concurrency retail applications.',
            'I scaled the front-end architecture for a major retail application (Pernambucanas) using a service-oriented hexagonal pattern.',
            'I engineered a high-performance Redis/SWR caching layer, providing the low-latency foundation necessary for AI-driven data apps.',
            'I migrated legacy workflows to Nuxt 3, improving system throughput and team development velocity.',
          ],
        },
        {
          title: 'Student Admission Application',
          org: 'UniFAJ',
          delivered: [
            'I developed the end-to-end user interface for the student admission application, covering all critical stages from initial registration to the completion of exams and essays.',
            'I implemented key new features while simultaneously restructuring legacy code, applying clean code principles to enhance the application\'s maintainability and overall quality.',
          ],
        },
        {
          title: 'Web Solutions & AI Integration',
          org: 'Agência Industrial',
          delivered: [
            'I delivered complete, end-to-end web solutions for multiple clients, managing the entire project lifecycle from UI/UX design to full-stack implementation and deployment.',
            'I enhanced client projects by developing and integrating small-scale AI solutions using the GPT-3 API with Python and Node.js.',
          ],
        },
        {
          title: 'Legacy Application Refactoring & CMS Integration',
          org: 'ITH Pós Graduação',
          delivered: [
            'I led a complete refactoring of the legacy application, a project that directly improved Google Speed Insight scores and significantly reduced advertising expenses.',
            'I developed and launched a new front-end application using Nuxt2, which integrated with the company\'s WordPress CMS to modernize the user experience and content delivery.',
          ],
        },
      ],
    },
    active: 'Active',
    download_curriculum: 'Download Curriculum',
    me: {
      summary: 'Generative AI Engineer with 2 years of specialized experience building production-grade LLM and RAG applications, backed by 8+ years in full-stack software engineering. I combine deep expertise in backend systems, databases, and frontend (Python, Node.js, Vue/Nuxt) with modern AI frameworks (LangChain, Vector DBs) to design and ship scalable, intelligent systems. Proven track record of leading architectural migrations and delivering high-impact AI solutions for international markets.',
      abroad: `During my career, I have worked on international projects, 
            collaborating daily with people from all over the world and aligning strategies 
            with backend and frontend teams. After **8 years** of experience, I offer expertise 
            based on concrete cases.`,
      passion: `My passion is to bridge the gap between imagination and reality. I breathe code and dream in pixels. I'm a web developer with a passion for crafting beautiful 
            and functional web applications.`,
      stack: `I love working with so many great frameworks and libraries! For my ideal project, I'd definitely choose to use...`,
      legacy: `While greenfield projects are exciting, I'm also comfortable tackling existing codebases. I'm skilled at working with 
            and migrating legacy technologies like Vue 2, Nuxt 2, various component libraries, plain JavaScript, jQuery, and more. So, 
            bring on your brownfield projects - I'm ready to modernize and optimize them!`,
      open_source: `My enthusiasm for open source software drives me to make meaningful contributions during my free time. Feel free to give a look at my github!`,
      years_old: 'I am {years} years old',
      live_in: 'Actually i live in Brazil',
    },
    hero: {
      fl: 'Consultant &',
      sl: 'Developer',
      tl: 'Experienced',
    },
    navigation: {
      menu: 'Menu',
      settings: 'Settings',
      back: 'Go back',
    },
    sections: {
      statement: {
        title: 'Statement',
      },
      about_me: {
        title: 'The Pixel Architect',
        accent: 'About me',
      },
      stack: {
        title: 'My Development Arsenal',
        accent: 'Tech Stack',
      },
      open_source: {
        title: `I ❤️ open source!`,
        accent: 'Open Source',
      },
      experiences: {
        title: 'Experiences',
      },
      projects: {
        title: 'Projects',
      },
    },
    time: {
      the_moment: 'Present',
      until_the: 'until',
      reading_time: '{time} reading',
    },
    settings: {
      dark_mode: 'Dark mode',
      light_mode: 'Light mode',
    },
    errors: {
      invalidString: { url: 'teste' },
    },
    chat: {
      input_label: 'Type your message...',
      reply_in_second: 'I typically reply in a second',
      talk_to_cat: 'She can be sarcastic, but she\'s also incredibly smart and funny. 😹 Who knows, if you catch her in a good mood, she might even tell you some feline secrets!',
      tool_calendar: {
        availability: 'Availability',
        loading: 'Checking calendar...',
        error: 'Error checking calendar, try again.',
        free_slots: 'Free Slots',
        busy_slots: 'Scheduled Appointments',
        no_slots: 'No free slots found during business hours for this day.',
        timezone_difference: 'Different time zone:'
      },
      tool_meet: {
        confirm: 'Confirm Appointment',
        description: 'Do you want to schedule the following meeting?',
        summary: 'Title:',
        start: 'Start:',
        end: 'End:',
        attendees: 'Guests:',
        approve: 'Schedule Meeting',
        deny: 'Cancel',
        scheduled: 'Request Sent!',
        next_step: 'Awaiting Confirmation',
        next_step_desc: 'Gabriel will evaluate his availability. You will receive the official confirmation and meeting link at the provided email.',
        open_calendar: 'Open Calendar',
        loading: 'Scheduling event in calendar...',
        error: 'Error scheduling meeting, please try again.',
        denied_alert: 'Meeting request canceled.'
      }
    },
  }
})

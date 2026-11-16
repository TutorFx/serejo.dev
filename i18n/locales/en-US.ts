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
        path: '/',
        title: 'Home',
        description:
          'High-quality web development for new and legacy projects. Contact Gabriel Serejo today!',
        keywords:
          'Web development, new projects, legacy projects, custom solutions, high quality, Gabriel Serejo, AI Engineer, Full Stack',
        summary:
          'Personal portfolio of Gabriel Serejo, Generative AI & Full Stack Engineer with 6+ years of experience. Features introduction (Hero), international experience overview, technical stack arsenal, and highlighted professional experience.',
      },
      history: {
        path: '/my-trajectory',
        title: 'Job history',
        description:
          'Experienced web developer with a proven track record in international projects and a passion for turning ideas into reality. Skilled in various technologies including Vue, Nuxt and JavaScript. Open-source enthusiast and ready for new challenges.',
        keywords:
          'Web Developer, Front-end, Vue, Nuxt, JavaScript, Hexagonal Architecture, Service Layers, Vuetify, WordPress, Legacy Projects, Website Development, Landing Pages, International, Portugal, Brazil, Career History',
        summary:
          'Complete professional trajectory and career timeline of Gabriel Serejo. Detailed records of companies (Implanta IT Solutions, TLScontact, Cliqx, UniFAJ, Agência Industrial), delivered roles, achievements, and architectural migrations.',
      },
      projects: {
        path: '/projects',
        title: 'Projects',
        description:
          'Gabriel Serejo Dev: Professional journey and projects. Experiences in front-end development and feature implementation.',
        keywords:
          'Gabriel Serejo, Web Developer, Front-end Developer, Feature Implementation, Web Projects, Professional Journey, Experience, Portfolio, Open Source, AI Projects',
        summary:
          'Showcase of software engineering and AI projects built by Gabriel Serejo, including web applications, open source libraries, tools, and technical demonstrations.',
      },
      blog: {
        path: '/blog',
        title: 'Blog',
        description:
          'Technical articles, tutorials, and insights on Web Development, Generative AI, Nuxt, Vue, TypeScript, AI Agents, and Software Architecture by Gabriel Serejo.',
        keywords:
          'Blog, Web Developer, Front-end, Vue, Nuxt, JavaScript, TypeScript, Generative AI, LLMs, AI Agents, RAG, Architecture, Articles, Tutorials',
        summary:
          'Technical blog listing articles, tutorials, and thought pieces by Gabriel Serejo on modern web engineering, AI integrations, performance, and best practices.',
      },
      resume: {
        path: '/resume',
        title: 'Resume',
        description:
          'Gabriel Serejo - Generative AI & Full Stack Engineer Resume. Summary, technical proficiencies, certifications, and work experience.',
        keywords:
          'Resume, CV, Gabriel Serejo, Generative AI Engineer, Full Stack Developer, Skills, Certifications, Career History',
        summary:
          'Printable and digital Resume of Gabriel Serejo. Displays profile summary, technical skills (Python, TypeScript, Vue/Nuxt, LangChain, RAG, pgvector), AI certifications, and major career projects.',
      },
      curriculum: {
        path: '/curriculum',
        title: 'Curriculum Vitae',
        description:
          'Gabriel Serejo - Curriculum Vitae. Comprehensive overview of professional experience, academic education, certifications, and competencies.',
        keywords:
          'Curriculum Vitae, CV, Gabriel Serejo, AI Engineer, Full Stack Developer, Education, Experience, Certifications',
        summary:
          'Comprehensive Curriculum Vitae (CV) of Gabriel Serejo detailing full work history, academic education, certifications, and technical proficiencies in software engineering and AI.',
      },
    },
    SCHEDULE_support_text:
      "I'm Gabriel Serejo. I've been building software for over 6 years, the last 2 putting agents and RAG into production inside systems that already existed.",
    SCHEDULE_cta: 'Book a call',
    description: 'Description',
    see_more: 'See more',
    copyright: 'All rights reserved',
    footer: {
      privacy_policy: 'Privacy policy',
      contact: 'Contact',
    },
    curriculum: {
      profession: "Senior Full-Stack Developer {'|'} Agentic and Generative AI",
      summary: 'Summary',
      work_experience: 'Work Experience',
      education: 'Education',
      graduated_in: 'Completed {date}',
      in_progress: 'In Progress',
      technical_proficiencies: 'Technical Skills',
      certifications_title: 'Certifications',
      professional_experience: 'Experience',
      skills: [
        {
          title: 'Agentic AI and LLMs',
          items:
            'Model Context Protocol (MCP client/server), multi-agent systems, LangGraph, LangChain, Vercel AI SDK, Amazon Bedrock, tool and function calling, prompt caching, reasoning and prompting patterns (ReAct, CoT, ToT)',
        },
        {
          title: 'Languages and Frameworks',
          items:
            'Python (FastAPI, asyncio), TypeScript, Node.js, React, Next.js, Java (Spring Boot), SQL',
        },
        {
          title: 'Vector Search and Data',
          items:
            'contextual hybrid search (BM25 + dense vectors), reciprocal rank fusion, pgvector (HNSW, IVFFlat), Redis, BullMQ, embedding models, semantic reranking (bge-reranker)',
        },
        {
          title: 'Architecture and APIs',
          items:
            'microservices, event-driven architecture, DDD, SOLID, ports and adapters (hexagonal architecture), dependency inversion, REST, BFF pattern',
        },
        {
          title: 'Security, Testing, and Observability',
          items:
            "OpenTelemetry (OTel), Datadog, LangSmith, DeepEval, document and RAG evaluation (grounding, Recall{'@'}K, Precision{'@'}K), Microsoft Presidio and GLiNER (PII anonymization), deterministic guardrails, automated testing (pytest, Vitest)",
        },
        {
          title: 'Cloud, DevOps, and Infrastructure',
          items:
            'AWS (Bedrock, ECS, S3, SES), Microsoft Azure, Terraform (IaC), Docker, CI/CD pipelines, Git',
        },
      ],
      certifications: [
        'Oracle Agentic AI Foundations Associate (2026)',
        'Google AI Professional Certificate (2026)',
        'Oracle AI Vector Search Certified Professional (2025)',
      ],
    },
    active: 'Active',
    download_curriculum: 'Download CV',
    me: {
      summary:
        'Senior full-stack developer with over 6 years in software development, 2 of them on generative AI systems, agents, and RAG in production. Day-to-day work involves integrating LLMs into software that already runs in production, mostly with TypeScript, Python, Node.js, and React. A lot of it is on the reliability and engineering layer around these models: Model Context Protocol (MCP), hybrid search on PostgreSQL (pgvector), deterministic validation, observability (OpenTelemetry and Datadog), and PII anonymization.',
      abroad: `During my career, I have worked on international projects, 
            collaborating daily with people from all over the world and aligning strategies 
            with backend and frontend teams. After **6 years** of experience, I offer expertise 
            based on concrete cases.`,
      passion:
        "I'm a full-stack developer with a postgraduate specialization in AI from the Federal University of Viçosa. My focus is the engineering around the models: search, validation, observability, and sensitive data protection.",
      stack:
        "I work with AI frameworks and libraries like LangChain, LangGraph, and the Vercel AI SDK. For my ideal project's front end, I'd choose...",
      legacy:
        "While greenfield projects are exciting, I'm also comfortable tackling existing codebases. I have experience maintaining and migrating legacy systems built with Vue 2, Nuxt 2, component libraries, plain JavaScript, and jQuery. If your team has a brownfield project, I can modernize and optimize it and, where it makes sense, integrate language models into it without a rewrite.",
      open_source:
        'My interest in open source software leads me to contribute in my free time. You can read the code of this site, including its AI chat agent, on my',
      years_old: 'I am {years} years old',
      live_in: 'Actually i live in Brazil',
    },
    hero: {
      fl: 'Senior',
      sl: 'Full-Stack',
      tl: 'and AI',
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
        title: 'Generative AI Engineering',
        accent: 'About me',
      },
      stack: {
        title: 'My Development Toolkit',
        accent: 'Tech Stack',
      },
      open_source: {
        title: 'I support open source',
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
      greeting: {
        hello: 'Hello',
        morning: 'Good morning',
        afternoon: 'Good afternoon',
        evening: 'Good evening',
        with_name: '{greeting}, {name}',
      },
      tool_calendar: {
        availability: 'Availability',
        loading: 'Checking calendar...',
        error: 'Error checking calendar, try again.',
        free_slots: 'Free Slots',
        busy_slots: 'Scheduled Appointments',
        no_slots: 'No free slots found during business hours for this day.',
        timezone_difference: 'Different time zone:',
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
        next_step_desc:
          'Gabriel will evaluate his availability. You will receive the official confirmation and meeting link at the provided email.',
        open_calendar: 'Open Calendar',
        loading: 'Scheduling event in calendar...',
        error: 'Error scheduling meeting, please try again.',
        denied_alert: 'Meeting request canceled.',
        datetime: '{date} at {time}',
      },
      tool_search: {
        loading: 'Searching knowledge base...',
        completed: 'Searched knowledge base',
        error: 'Error querying knowledge base',
        no_results: 'No matching content found',
        results_count: '{count} result | {count} results',
        view_page: 'Open page',
        collections: {
          blog: 'Blog',
          education: 'Education',
          history: 'Career',
          projects: 'Projects',
          pages: 'Pages',
          routes: 'Pages & Routes',
        },
      },
      history: {
        today: 'Today',
        yesterday: 'Yesterday',
        last_week: 'Last week',
        last_month: 'Last month',
      },
      ui: {
        untitled: 'Untitled',
        recent_conversations: 'Recent conversations',
        rename: 'Rename',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save',
        chat_actions: 'Chat actions',
        open_chat: 'Open Serejo Chat',
        close_chat: 'Close the chat',
        back_to_list: 'Back to conversations',
        unavailable_title: 'Conversation unavailable',
        unavailable_description: 'It may have been deleted or is no longer shared.',
        prompt_placeholder: 'Ask anything or schedule a meeting...',
        thinking: 'Thinking...',
        not_found: 'Chat not found',
        vote_failed: 'Failed to save vote',
        copy_response: 'Copy response',
        good_response: 'Good response',
        bad_response: 'Bad response',
        searching_web: 'Searching the web...',
        searched_web: 'Searched the web',
        rename_title: 'Rename chat',
        rename_description: 'Choose a new title for this chat.',
        rename_placeholder: 'Chat title',
        rename_failed: 'Failed to rename chat',
        delete_title: 'Delete chat',
        delete_description: 'Are you sure you want to delete this chat? This cannot be undone.',
        deleted_title: 'Chat deleted',
        deleted_description: 'Your chat has been deleted',
        delete_failed: 'Failed to delete chat',
        share: 'Share chat',
        shared: 'Chat shared',
        share_description_private: 'Only you can view this chat.',
        share_description_public: 'Anyone with the link can view this chat.',
        keep_private: 'Keep private',
        keep_private_description: 'Only you have access',
        shared_option: 'Shared',
        shared_option_description: 'Anyone with the link can view',
        visibility_failed: 'Failed to update visibility',
        copy_link: 'Copy link',
        copied: 'Copied!',
        log_out: 'Log out',
        create_failed: 'Failed to start the chat',
      },
      errors: {
        rate_limited: 'You are sending messages too fast. Please wait a moment and try again.',
        budget_exceeded:
          'You reached the daily usage limit of the assistant. Please come back tomorrow.',
        chat_disabled: 'The assistant is temporarily unavailable. Please try again later.',
        chat_busy:
          'The assistant is still answering your previous message. Please wait for it to finish.',
        payload_too_large: 'This message is too long. Please shorten it and try again.',
        invalid_request:
          'This message could not be processed. Please reload the page and try again.',
        approval_invalid: 'This request is no longer pending. Please reload the page.',
        session_expired: 'Your session expired. Please reload the page and try again.',
        stream_error: 'The assistant could not answer right now. Please try again.',
        generic: 'Something went wrong. Please try again.',
      },
      quick: {
        schedule_meeting: 'Schedule a meeting with Gabriel',
      },
    },
  }
})

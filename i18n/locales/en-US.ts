export default defineI18nLocale(async (/* locale */) => {
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
      }
    },
    SCHEDULE_support_text: `Hey! I am Gabriel, a web engineering consultant based in Brazil. 
        I help companies to build better web applications and to improve their knowledge, 
        workflows, and culture.`,
    SCHEDULE_cta: 'SCHEDULE a call',
    description: 'Description',
    see_more: 'See more',
    copyright: 'All rights reserved',
    curriculum: {
      profession: 'Software Engineer',
      summary: 'Summary',
      work_experience: 'Work Experience',
      education: 'Education',
      graduated_in: 'Graduated in {date}',
      in_progress: 'In progress',
    },
    active: 'Active',
    download_curriculum: 'Download Curriculum',
    me: {
      summary: 'Gabriel Serejo is a highly experienced web developer with a passion for turning ideas into reality. His expertise spans front-end and back-end development, legacy system modernization, and open-source contribution. With a proven track record in international projects, Gabriel excels in collaborating with diverse teams and leveraging technologies like Vue, Nuxt, and JavaScript to deliver high-quality web applications.',
      abroad: `During my career, I have worked on international projects, 
            collaborating daily with people from all over the world and aligning strategies 
            with backend and frontend teams. After **7 years** of experience, I offer expertise 
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
      the_moment: 'the moment',
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
    },
  }
})

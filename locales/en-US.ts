export default defineI18nLocale(async (locale) => {
  return {
    menu: {
      home: 'Home',
      about: 'About me',
      history: 'Trajectory',
      projects: 'Projects',
      blog: 'Blog',
    },
    schedule_support_text: `Hey! I am Gabriel, a web engineering consultant based in Brazil. 
        I help companies to build better web applications and to improve their knowledge, 
        workflows, and culture.`,
    schedule_cta: 'Schedule a call',
    description: 'Description',
    see_more: 'See more',
    copyright: 'All rights reserved',
    active: 'Active',
    me: {
      abroad: `During my career, I have worked on international projects, 
            collaborating daily with people from all over the world and aligning strategies 
            with backend and frontend teams. After :gradient-text[7 years] of experience, I offer expertise 
            based on concrete cases.`,
      passion: `My passion is to bridge the gap between imagination and reality, making my dreams come 
            true. I breathe code and dream in pixels. I'm a web developer with a passion for crafting beautiful 
            and functional web applications.`,
      stack: `I love working with so many great frameworks and libraries! But for my ideal project, I'd definitely choose to use...`,
      legacy: `While greenfield projects are exciting, I'm also comfortable tackling existing codebases. I'm skilled at working with 
            and migrating legacy technologies like Vue 2, Nuxt 2, various component libraries, plain JavaScript, jQuery, and more. So, 
            bring on your brownfield projects - I'm ready to modernize and optimize them!`,
      open_source: `My enthusiasm for open source software drives me to make meaningful contributions during my free time. Feel free to give a look at my github!`,
    },
    hero: {
      fl: 'Consultant &',
      sl: 'Developer',
      tl: 'Experienced',
    },
    navigation: {
      menu: 'Menu',
      settings: 'Settings',
    },
    sections: {
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
    },
    time: {
      the_moment: 'the moment',
      until_the: 'until',
    },
    settings: {
      dark_mode: 'Dark mode',
      light_mode: 'Light mode',
    },
  }
})

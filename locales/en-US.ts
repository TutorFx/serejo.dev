export default defineI18nLocale(async locale => {
    return {
        menu: {
            home: 'Home',
            about: 'About me',
            history: 'Trajectory',
            projects: 'Projects',
            blog: 'Blog'
        },
        schedule_support_text: `Hey! I am Gabriel, a web engineering consultant based in Brazil. 
        I help companies to build better web applications and to improve their knowledge, 
        workflows, and culture.`,
        schedule_cta: 'Schedule a call',
        me: {
            stack: `Hi! I've been a web developer for several years now. 
            I find working with various frameworks and libraries to be enjoyable. 
            If I could choose, my dream stack would be Vue, Nuxt, Typescript, and Tailwind.`
        },
        hero: {
            fl: "Consultant &",
            sl: "Developer",
            tl: "Experienced"
        }
    }
})
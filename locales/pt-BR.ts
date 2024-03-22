export default defineI18nLocale(async locale => {
    return {
        menu: {
            home: 'Início',
            about: 'Sobre mim',
            history: 'Trajetória',
            projects: 'Projetos',
            blog: 'Blog'
        },
        schedule_support_text: `Olá! Sou Gabriel, consultor de engenharia web baseado no Brasil. 
        Ajudo empresas a construir melhores aplicações web e a aprimorar seus conhecimentos, 
        fluxos de trabalho e cultura.`,
        schedule_cta: 'Agende uma chamada',
        description: 'Descrição',
        see_more: 'Ver mais',
        copyright: 'Todos os direitos reservados',
        me: {
            abroad: `Durante minha carreira, trabalhei em projetos internacionais, 
          colaborando diariamente com pessoas de todo o mundo e alinhando estratégias 
          com equipes de backend e frontend. Após :gradient-text[7 anos] de experiência, 
          ofereço expertise com base em casos concretos.`,
            passion: `Minha paixão é preencher a lacuna entre a imaginação e a realidade, 
          tornando meus sonhos realidade. Respiro código e sonho em pixels. Sou um 
          desenvolvedor web apaixonado por criar aplicações web bonitas e funcionais.`,
            stack: `Adoro trabalhar com tantos frameworks e bibliotecas incríveis! Mas para 
          o meu projeto ideal, eu definitivamente escolheria usar...`,
            legacy: `Embora projetos no início sejam empolgantes, também me sinto 
          confortável em lidar com bases de código existentes. Sou hábil em trabalhar 
          com e migrar tecnologias legadas como Vue 2, Nuxt 2, várias bibliotecas de 
          componentes, JavaScript puro, jQuery e muito mais. Então, traga seus projetos 
          legado - estou pronto para modernizá-los e otimizá-los!`,
            open_source: `Meu entusiasmo por software de código aberto me leva a fazer 
          contribuições significativas durante meu tempo livre. Sinta-se à vontade para 
          dar uma olhada no meu github!`
        },
        hero: {
            fl: "Consultor &",
            sl: "Desenvolvedor",
            tl: "Experiente"
        },
        navigation: {
            menu: 'Menu',
            settings: 'Configurações',
        },
        sections: {
            about_me: {
                title: 'O Arquiteto de Pixels',
                accent: 'Sobre mim'
            },
            stack: {
                title: 'Meu Arsenal de Desenvolvimento',
                accent: 'Tech Stack',
            },
            open_source: {
                title: `Eu ❤️ código aberto!`,
                accent: 'Open Source'
            },
            experiences: {
                title: 'Experiências',
            },
        },
        time: {
            the_moment: 'o momento',
            until_the: 'até'
        }
    }
})
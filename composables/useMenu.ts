const NAVBAR_CONTENT = defineMenuConfig(() => [
    {
        content: "Meu Perfil",
        LinkType: LinkType.InternalLink,
        url: 'index',
    },
    {
        content: "História",
        LinkType: LinkType.InternalLink,
        url: "about-me",
    },
    {
        content: "Projetos",
        LinkType: LinkType.InternalLink,
        url: "projects",
    },
    {
        content: "Blog",
        LinkType: LinkType.InternalLink,
        url: "blog",
    },
])

export const useNavbar = () => useMenu(NAVBAR_CONTENT);
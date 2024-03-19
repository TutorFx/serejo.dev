const NAVBAR_CONTENT = defineMenuConfig(() => [
    {
        content: 'menu.about',
        LinkType: LinkType.InternalLink,
        url: 'index',
    },
    {
        content: 'menu.history',
        LinkType: LinkType.InternalLink,
        url: "history",
    },
    {
        content: 'menu.projects',
        LinkType: LinkType.InternalLink,
        url: "projects",
    },
    {
        content: 'menu.blog',
        LinkType: LinkType.InternalLink,
        url: "blog",
    },
]
)

export const useNavbar = () => useMenu(NAVBAR_CONTENT);
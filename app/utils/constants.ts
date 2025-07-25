export * from './_core/core.constants'
export * from './menu/menu.constants'
export * from './button/button.constants'
export * from './card/card.constants'
export * from './chat/chat.constants'

export const NAVBAR_CONTENT: MenuList = [
  {
    label: 'menu.about',
    to: { name: 'index' },
  },
  {
    label: 'menu.history',
    to: { name: 'history' },
  },
  /*   {
    label: 'menu.projects',
    to: { name: 'projects' },
  }, */
  {
    label: 'menu.blog',
    to: { name: 'blog' },
  },
]

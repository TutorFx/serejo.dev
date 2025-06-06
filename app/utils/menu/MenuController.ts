import type { RouteNamedMapI18n } from 'vue-router/auto-routes'
import type { IMenu, IRouteLocationRawSchema } from '../menu'
import { LinkType } from '../menu'
import type { RouteLocationRaw } from '#vue-router'

interface ExternalBinding {
  href: string
}

interface InternalBinding {
  to: string | RouteLocationRaw
}

interface MenuItemInterface extends IMenu {
  getBinding: () => ExternalBinding | InternalBinding
}

export default class MenuItem implements MenuItemInterface {
  LinkType: LinkType
  url: string
  content: IRouteLocationRawSchema
  constructor(menu: IMenu) {
    this.LinkType = menu.LinkType
    this.url = menu.url
    this.content = menu.content
  }

  /**
   * Gets the binding information based on the LinkType.
   *
   * This method determines whether a menu item is an internal or external link
   * and provides the appropriate binding object needed for navigation.
   * @returns {ExternalBinding | InternalBinding} The binding object containing the URL or path for the link.
   */
  getBinding() {
    const localePath = useLocalePath()
    const bindings: Record<LinkType, ExternalBinding | InternalBinding> = {
      [LinkType.ExternalLink]: {
        href: this.url,
      },
      [LinkType.InternalLink]: {
        to: localePath(this.url as keyof RouteNamedMapI18n),
      },
    }
    return bindings[this.LinkType]
  }
}

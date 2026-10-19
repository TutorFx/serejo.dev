// nuxt-csurf augments `nitropack`, but in this Nitro version `NitroRouteConfig` is declared in
// `nitropack/types`, so the `csurf` route rule (used to exempt routes) needs this augmentation
declare module 'nitropack/types' {
  interface NitroRouteConfig {
    csurf?:
      | false
      | {
          enabled?: boolean
          methodsToProtect?: string[]
        }
  }
}

export {}

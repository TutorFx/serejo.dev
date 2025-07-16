---
title: Nuxt 4 is Coming with No Major Changes. And That's Good!
createdAt: 2024-04-25T00:00:00.000Z
slug: what-to-expect-for-nuxt-4
---

In recent years, we've seen a great evolution from Nuxt, and with evolution, we also have many breaking changes.

> But what to expect from Nuxt 4? In recent years, thousands of devs lost a lot of hair migrating entire codebases to the Composition API.

Well, if that's your fear, you can relax. The Nuxt development team now aims to follow [semver](https://semver.org/).

## What to expect from Nuxt 4

The goal of Nuxt 4 is not to create hype about this version. It is to remain stable and almost completely compatible with version 3. If you already want to prepare for the future, here are some of those changes:

### Features

- Now the subdirectories of composables, plugins and middleware will be scanned recursively.

### Deprecations

During the last few years, the Nuxt 2 → Nuxt 3 update caused the Nuxt repository to be completely rewritten to present the recent absurd performance changes. However, this year the Nuxt team put on the brakes. And this shows that Nuxt is already a mature Fullstack Framework and ready for various scenarios.

- The properties `process.client` and `process.server` will be soft\-deprecated, meaning their use will issue a warning. The correct approach from now on is to use `import.meta.client` or `import.meta.server`.

* NuxtLink will lose the props noPrefetch, noRel and externalRelAttribute. Currently, it is being discussed whether these props will be included in a module, so that if the user intends to continue using them, it will be possible.

* The useFetch composable will now have a long-awaited new feature. Inside the useFetch object, there will now be a variable reference with the response status, which can be "idle", "pending", "success" or "error". On the other hand, pending will be removed in favor of this new addition.

* Another notable change is that the params alias of ofetch will now be removed. So if you use this alias in your codebase, it's time to switch to query.

### Breaking Changes

Thanks to [NitroJS](https://nitro.unjs.io/), Nuxt has evolved from a "Meta-framework" to a "Fullstack-framework". And to make it a bit more modular, there will be some changes in the directory structure. If the utils is positioned in the path ~/utils, it will be used in both the Backend and Frontend.

> And I must say. This will be great for organizing zod schemas!

```
.output/
.nuxt/
app/
  assets/
  components/
  composables/
  layouts/
  middleware/
  pages/
  plugins/
  utils/
  main.vue
  router.options.ts
content/
layers/
modules/
node_modules/
public/
server/
  api/
  middleware/
  plugins/
  routes/
  utils/
nuxt.config.ts
```

### Performance Improvements

- In Nuxt 3, useFetch has a watcher that observes references (ref()). By default, this observer is set with { deep: true }. In this case, deep is completely unnecessary and consumes a lot of browser resources.

### For module developers

- Now the Lifecycle hook builder:watch will emit the absolute path of the application

* @nuxt/kit templateUtils will be deprecated and eventually removed.

## The Future of Nuxt 4

Now with the house in order, attention turns back to the modules, as in Nuxt 2...

As the Nuxt 2 → Nuxt 3 codebase needed to be completely rewritten, all the old modules are also being rewritten now. So we have in view a very comfortable scenario, as it looked like in the golden age of Nuxt 2. Just as Daniel Roe said, in his talk at CityJS London:

> Our focus will be on reassuring people that they will never experience anything as painful as the Nuxt 2 → Nuxt 3 migration again.

And I must say, I'm completely excited about not having to rewrite all the codebases I maintain at the moment 😂.

Follow in real time the [progress of Nuxt 4 updates](https://github.com/nuxt/nuxt/issues?q=is%3Aopen+is%3Aissue+milestone%3A4.0).

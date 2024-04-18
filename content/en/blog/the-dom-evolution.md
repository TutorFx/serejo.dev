---
title: The Evolution of Virtual DOMs in JavaScript Frameworks
createdAt: 2024-04-18T00:00:00.000Z
---

A few years ago, with the popularization of frontend frameworks, we saw a growing movement in the market towards choosing Virtual DOMs. So, that means it's the right way to go, right?...

> Wrong. In reality, when it comes to technology, there is no right or wrong. There is only the most suitable solution for your project. But to understand which type of DOM is the most appropriate, we need to understand what DOM and Virtual DOM are.

**DOM**, or **Document Object Model**, is a representation of screen data in a format that the browser can read. It's a kind of blueprint of the HTML and CSS. The integration between Javascript, HTML, and CSS is done through the DOM API.

Now that you're a DOM expert, let's talk about the Virtual DOM.

### Virtual DOM

The key point that differentiates both types of DOM is that the Virtual DOM is **declarative**. That is, you have a series of "shortcuts" to develop functionalities, speeding up the development process. The real DOM, on the other hand, can be imperative or declarative. However, changes in the real DOM can lead to unpredictable side effects on screens with many interactions. The smallest error could break the entire application.

> So wait, why are Svelte, Ember, Angular, and Vue Vapor going against the grain when a few years ago, everyone was talking about virtual DOM and declarative frameworks?

No, they're not going against the grain. Development is still declarative. The difference is that now, with the technology of modern compilers, a Virtual DOM is no longer necessary to take advantage of the benefits of frameworks. So, without the need for a copy of the entire DOM, you can still use features like Reactivity, and the Developer Experience will still have Stability in your project. Even though the Virtual DOM was a dominant trend, Angular already used a similar approach.

A common misconception is that the Virtual DOM makes any application faster. While complex applications, with a lot of information on the screen, can benefit from a Virtual DOM, this is not always true. What happens is that developers argue about which is faster or not, but they forget that there are specific applications for all kinds of scenarios. They are different solutions for different problems.

The main reason Frameworks were created was to make the developer experience more pleasant in large teams with many people. This way, everyone must follow a standard, and this helps a Dev to be allocated to another team and know more or less how things work, which helps a lot in this integration.

In Vue 3, for example, it's possible to choose between the Virtual DOM and the virtual DOM-free version, maintaining the same framework syntax. This is the new bet of the Vue development team. Not to mention the possibility of using Server Components in Nuxt3 to further reduce the package that reaches the client.

### Performance Matters

Recently, Google changed its Core Web Vitals guidelines, and now page display policies are becoming more restrictive. With Google demanding ever-lower latencies, companies are cornered into getting better results and modernizing their stacks to achieve the "100 Score on Google PageSpeed Insights" dream.

The web application should not only be fast on powerful and current development computers but should also run well on even the worst cell phones. It turns out that the addition of Vapor Mode fit like a glove in Vue 3, and it is increasingly becoming a versatile tool for all kinds of scenarios.

At the time of this publication, Vue Vapor is still in an experimental phase, but you can follow the development progress on Github: [see more](https://github.com/vuejs/core-vapor?tab=readme-ov-file#todo)

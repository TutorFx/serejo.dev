---
title: 'The Component Architecture That Shadcn and Nuxt UI Popularized (And How to Use It Today)'
createdAt: 2025-06-07T00:00:00.000Z
---

Creating reusable and highly customizable components is one of the pillars of a good Design System. However, as we add new variations (colors, sizes, styles), the code can become a complex web of conditional classes, making it difficult to read and maintain.

In this guide, we'll explore a clean and scalable approach using **Tailwind Variants** to build a cohesive component system. Although the practical example is in Vue.js (Nuxt), the logic applies to any framework, whether it's React, Svelte, or Angular.

---

To demonstrate the technique, I'll create a button component using Nuxt 3 (and Vue 3). However, this technique can be used with any JavaScript framework.
To keep things simple, we'll focus on the steps to implement size and rounding, but the same logic will be used to add colors and styles, as you'll see in the final code.
A more complete version of the button component can be found in the [Design System](https://github.com/TutorFx/article-how-to-use-tailwind-variants-with-nuxt3) repository.

#### 1. Declaring Constant Variables

It all starts with standardization. Instead of scattering values like `'sm'`, `'md'`, or `'lg'` throughout the code, we'll centralize them in a single place. This ensures consistency and makes future changes easier.

Create a file to store all your Design System options.

```typescript
// app/utils/constants.ts

export const COMPONENT_SIZE_KEY_XSMALL = 'xxs'
export const COMPONENT_SIZE_KEY_SMALL = 'sm'
export const COMPONENT_SIZE_KEY_MEDIUM = 'md'
export const COMPONENT_SIZE_KEY_LARGE = 'lg'
export const COMPONENT_SIZE_KEY_XLARGE = 'xl'

export const CORE_SIZE = {
  xs: COMPONENT_SIZE_KEY_XSMALL,
  sm: COMPONENT_SIZE_KEY_SMALL,
  md: COMPONENT_SIZE_KEY_MEDIUM,
  lg: COMPONENT_SIZE_KEY_LARGE,
  xl: COMPONENT_SIZE_KEY_XLARGE,
} as const

export const DEFAULT_SIZE = CORE_SIZE.md
export const COMPONENT_SIZES_ARRAY = Object.values(CORE_SIZE)
```

> NOTE: In the final repository, you will also find constants for COLORS and VARIANTS (solid, outline, and ghost), following this same pattern.

For constants, we always use the convention of uppercase letters separated by underscores (known as screaming snake case) and `as const` to ensure TypeScript understands that these values won't change, allowing for better type inference.
This will help us keep the code more organized and easier to understand, even as the project grows.

#### 2. Defining the Base Component's Types and Interfaces

This step is important for standardizing properties that will be common to all the components we create, such as size, color, etc. Additionally, we'll ensure that TypeScript correctly understands the types of these properties.

Below, we'll define the type that represents all available sizes for the button component. This will then allow us to declare the component's `size` property type.

```typescript
// app/utils/types.ts

export type ComponentSize = (typeof CORE_SIZE)[keyof typeof CORE_SIZE]
```

The next step is to define the type for the default configuration that all design system components will inherit.

```typescript
// app/utils/types.ts

export type GenericVariantKeyDefinition<T extends string> = Record<T, string | undefined>
export type BooleanKeyDefinition = Record<`${boolean}`, string | undefined>

export interface BaseVariant {
  size: GenericVariantKeyDefinition<ComponentSize>
  // ... other variations can be added here
}
```

From this, we'll define the interface that represents the properties of our base component.

```typescript
// app/utils/types.ts

export interface BaseProps {
  size?: ComponentSize
  // ... other properties can be added here
}
```

#### 3. Creating the Variants File

Now that we have a solid foundation for our design system, we can think about our variants file.

```typescript
// app/utils/variants/button.variant.ts

import { tv } from 'tailwind-variants'

// remember that nuxt 3 has support for automatic
// file imports, so we don't need
// to import BaseVariant
export interface ButtonVariant extends BaseVariant {
  rounded: BooleanKeyDefinition
}

export const button = tv({
  base: 'grid font-semibold rounded-lg text-sm',
  variants: {
    size: {
      [CORE_SIZE.xs]: 'text-xs py-1 px-2',
      [CORE_SIZE.sm]: 'text-sm py-1 px-3',
      [CORE_SIZE.md]: 'text-base py-2 px-4',
      [CORE_SIZE.lg]: 'text-lg py-2 px-5',
      [CORE_SIZE.xl]: 'text-xl py-3 px-6'
    },
    // ... other variations can be added here
  } satisfies ButtonVariant,
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
})
```

To make the variants file available for automatic import, let's add an export to the `app/utils/variants.ts` file.

```ts
// app/utils/variants.ts

export * from './variants/button.variant'
```

#### 4. Creating the Button Component

Now that we have the constants, types, and variations defined, we can create the button component. We'll use Tailwind Variants to apply the style variations dynamically.

```vue
// app/components/button.vue

<script lang="ts">
import { tv } from 'tailwind-variants'
import type { BaseProps } from '@/utils/types'
</script>

<script setup lang="ts">
export interface ButtonVariantProps extends BaseProps {
  rounded?: boolean
  class?: any
}

const props = withDefaults(defineProps<ButtonVariantProps>(), {
  size: DEFAULT_SIZE,
  rounded: false,
})

const ui = tv({
  extend: button,
  base: props.class,
})
</script>

<template>
  <div :class="ui(props)">
    <div>
      <slot />
    </div>
  </div>
</template>
```

::alert
**Why is the `props` interface declared here?**

Vue's Single-File Component (SFC) compiler uses macros like `defineProps` which, for performance reasons, analyze the code's structure (AST) directly within the `.vue` file, instead of performing a deep type analysis as TypeScript would in external files. This means it might not correctly resolve complex interfaces that are imported. By declaring the final props interface (`ButtonVariantProps`) locally, even if it extends an imported base type, we ensure the compiler perfectly understands the "shape" of the properties, avoiding errors and ensuring proper editor support.
::

#### 5. Adjusting VS Code Intellisense

Usually, VS Code doesn't recognize these variable definitions outside of `.vue`, `.tsx`, or `.jsx` files. To fix this, we can create a VS Code configuration file to improve the detection of these classes declared within the `tv()` function.

Create a file named `settings.json` in your project's `.vscode` folder and add the following content:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["tv\\({([\\s\\S]*?)}\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ]
}
```

This tells VS Code how to interpret the classes defined inside the `tv()` function, allowing IntelliSense to work correctly.

#### 6. Using the Button Component

Now that we have our button component set up, we can use it anywhere in our Nuxt 3 application. See how simple it is:

```vue
// app/pages/index.vue

<template>
  <div class="p-4 flex gap-4">
    <Button size="sm" color="primary" variant="solid" rounded>
      Primary Button
    </Button>

    <Button size="md" color="secondary" variant="outline">
      Secondary Button
    </Button>

    <Button size="lg" color="tertiary" variant="ghost">
      Tertiary Button
    </Button>
  </div>
</template>
```

### Conclusion

Throughout this guide, we've transformed what could be a chaos of conditional classes into a component-building paradigm that is simultaneously elegant, scalable, and easy to maintain. The true power of the **Tailwind Variants** approach lies in a fundamental architectural principle: decoupling the styling logic from the component's structure.

The result is a cleaner, smarter workflow. Our Vue component now focuses exclusively on its function and structure, while a dedicated variants file becomes the single source of truth for its appearance. This separation of concerns is not just a matter of organization; it's what makes scalability a trivial task. [1, 3] Adding a new color or style comes down to a single line of code, without ever touching the component itself. Maintenance is also simplified, as any visual adjustment is made in a predictable location. When we add the type safety and autocompletion that TypeScript and the correct VS Code configuration provide, we elevate the development experience to a new level of productivity and confidence.

This methodology isn't just about creating a button; it's about establishing a solid foundation for a **Design System** that can grow without friction. It's a philosophy that extends to any piece of your interface, from cards to modals, from inputs to badges.

It's impossible to talk about this approach without giving credit where it's due. A special thanks to the **shadcn** team, who truly broke the mold by popularizing the idea that a Design System doesn't have to be a black-box library, but rather a set of adaptable recipes that live within our own code. [4, 9, 11] Similarly, the inspiration for this article came in large part from the exceptional work of the **nuxt-labs** team. Projects like [Nuxt UI](https://ui.nuxt.com/) are living proof of the powerful application of these concepts in the Nuxt ecosystem, serving as a beacon for creating modern and efficient interfaces.

I hope this guide has provided the clarity and tools for you to build your own component systems more intelligently. The complete code, with more variations, is available in the [project repository](https://github.com/TutorFx/article-how-to-use-tailwind-variants-with-nuxt3). Now, go ahead and build amazing interfaces.

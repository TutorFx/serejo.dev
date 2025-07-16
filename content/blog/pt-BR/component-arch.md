---
title: 'A Arquitetura de Componentes que Shadcn e Nuxt UI Popularizaram (e Como Usá-la Hoje)'
createdAt: 2025-06-07T00:00:00.000Z
slug: arquitetura-de-componentes-shadcn-nuxt-ui-tailwind-variants
---

Criar componentes reutilizáveis e altamente customizáveis é um dos pilares de um bom Design System. No entanto, à medida que adicionamos novas variações (cores, tamanhos, estilos), o código pode se tornar uma teia complexa de classes condicionais, difícil de ler e manter.

Neste guia, vamos explorar uma abordagem limpa e escalável usando **Tailwind Variants** para construir um sistema de componentes coeso. Embora o exemplo prático seja em Vue.js (Nuxt), a lógica se aplica a qualquer framework, seja React, Svelte ou Angular.

---

Para demonstrar a técnica, irei criar um componente de botão usando Nuxt3 (e Vue3). No entanto, essa técnica pode ser utilizada com qualquer framework JavaScript.
Com o objetivo de manter a simplicidade, vamos focar nos passos para implementar tamanho e arredondamento, mas a mesma lógica será usada para adicionar cores e estilos, como você poderá ver no código final.
Uma versão mais completa do componente de botão pode ser encontrada no repositório do [Design System](https://github.com/TutorFx/article-how-to-use-tailwind-variants-with-nuxt3).

#### 1. Declarando as variáveis constantes

Tudo começa com a padronização. Em vez de espalhar valores como `'sm'`, `'md'` ou `'lg'` pelo código, vamos centralizá-los em um único lugar. Isso garante consistência e facilita futuras alterações.

Crie um arquivo para armazenar todas as opções do seu Design System.

```typescript [app/utils/constants.ts]
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

> NOTA: No repositório final, você também encontrará constantes para CORES e VARIANTES (solid, outline e ghost), seguindo este mesmo padrão.

Para constantes, nós sempre utilizamos a convenção de letras maiúsculas separadas por underscores (conhecida como screaming snake case) e `as const` para garantir que o TypeScript entenda que esses valores não vão mudar, permitindo uma melhor inferência de tipos.
Isso vai nos ajudar a manter o código mais organizado e fácil de entender, mesmo quando o projeto crescer.

#### 2. Definindo tipos e interfaces do componente Base

Essa etapa é importante para padronizar algumas propriedades que serão comuns a todos os componentes que vamos criar, como tamanho, cor, etc. Além disso, vamos garantir que o TypeScript entenda corretamente os tipos dessas propriedades.

Abaixo, vamos definir o tipo que representa todos os tamanhos disponíveis para o componente de botão. Isso nos permitirá declarar em seguida o tipo de propriedade `size` do componente.

```typescript [app/utils/types.ts]

export type ComponentSize = (typeof CORE_SIZE)[keyof typeof CORE_SIZE]
```

O próximo passo é definir o tipo da configuração padrão que todos os componentes do design system herdarão.

```typescript [app/utils/types.ts]

export type GenericVariantKeyDefinition<T extends string> = Record<T, string | undefined>
export type BooleanKeyDefinition = Record<`${boolean}`, string | undefined>

export interface BaseVariant {
  size: GenericVariantKeyDefinition<ComponentSize>
  // ... outras variações podem ser adicionadas aqui
}
```

A partir disso, vamos definir a interface que representa as propriedades do nosso componente base.

```typescript [app/utils/types.ts]

export interface BaseProps {
  size?: ComponentSize
  // ... outras propriedades podem ser adicionadas aqui
}
```

#### 3. Criando o arquivo de variações

Agora que já temos uma base sólida para nosso design system, podemos pensar em nosso arquivo de variações.

```typescript [app/utils/variants/button.variant.ts]

import { tv } from 'tailwind-variants'

// lembrando que o nuxt3 tem suporte a importação
// automática de arquivos, então não precisamos
// importar o BaseVariant
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
    // ... outras variações podem ser adicionadas aqui
  } satisfies ButtonVariant,
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
})
```

Para o arquivo de variações estar disponível para importação automática, vamos adicionar um export no arquivo `app/utils/variants.ts`.

```typescript [app/utils/variants.ts]

export * from './variants/button.variant'
```

#### 4. Criando o componente de botão

Agora que já temos as constantes, tipos e variações definidas, podemos criar o componente de botão. Vamos utilizar o Tailwind Variants para aplicar as variações de estilo de forma dinâmica.

```vue [app/components/button.vue]

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
**Por que a interface de `props` é declarada aqui?**

O compilador de Single-File Components (SFC) do Vue utiliza macros como `defineProps` que, por questões de performance, analisam a estrutura do código (AST) diretamente no arquivo `.vue`, em vez de fazer uma análise de tipos profunda como o TypeScript faria em arquivos externos. Isso significa que ele pode não conseguir resolver corretamente interfaces complexas que são importadas. Ao declarar a interface final dos props (`ButtonVariantProps`) localmente, mesmo que ela estenda um tipo base importado, garantimos que o compilador entenda perfeitamente a "forma" das propriedades, evitando erros e garantindo o suporte correto do editor.
::

#### 5. Ajustando o intellisense do VSCODE

Normalmente o VSCODE não reconhece essas definições de variáveis fora dos arquivos `.vue`, `.tsx` ou `.jsx`. Para resolver isso, podemos criar um arquivo de configuração do vscode para melhorar a detecção dessas classes declaradas dentro da função `tv()`.

Crie um arquivo chamado `settings.json` na pasta `.vscode` do seu projeto e adicione o seguinte conteúdo:

```json [.vscode/settings.json]
{
  "tailwindCSS.experimental.classRegex": [
    ["tv\\({([\\s\\S]*?)}\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ]
}
```

Isso informa ao VSCODE como interpretar as classes definidas dentro da função `tv()`, permitindo que o IntelliSense funcione corretamente.

#### 6. Utilizando o componente de botão

Agora que temos nosso componente de botão configurado, podemos utilizá-lo em qualquer parte do nosso aplicativo Nuxt3. Veja como é simples:

```vue [app/pages/index.vue]
<template>
  <div class="p-4 flex gap-4">
    <Button size="sm" color="primary" variant="solid" rounded>
      Botão Primário
    </Button>

    <Button size="md" color="secondary" variant="outline">
      Botão Secundário
    </Button>

    <Button size="lg" color="tertiary" variant="ghost">
      Botão Terciário
    </Button>
  </div>
</template>
```

### Conclusão

Ao longo deste guia, transformamos o que poderia ser um caos de classes condicionais em um paradigma de construção de componentes que é, ao mesmo tempo, elegante, escalável e de fácil manutenção. O verdadeiro poder da abordagem com **Tailwind Variants** reside em um princípio arquitetônico fundamental: desacoplar a lógica de estilização da estrutura do componente.

O resultado é um fluxo de trabalho mais limpo e inteligente. Nosso componente Vue agora se concentra exclusivamente em sua função e estrutura, enquanto um arquivo de variantes dedicado se torna o único ponto de responsabilidade por sua aparência. Essa separação de interesses não é apenas uma questão de organização; é o que torna a escalabilidade uma tarefa trivial. Adicionar uma nova cor ou um novo estilo se resume a uma única linha de código, sem jamais tocar no componente em si. A manutenção também é simplificada, pois qualquer ajuste visual é feito em um local previsível. Quando somamos a isso a segurança de tipos e o autocompletar que o TypeScript e a configuração correta do VSCode nos proporcionam, elevamos a experiência de desenvolvimento a um novo patamar de produtividade e confiança.

Essa metodologia não se trata apenas de criar um botão; trata-se de estabelecer uma base sólida para um **Design System** que pode crescer sem atritos. É uma filosofia que se estende a qualquer peça de sua interface, de cards a modais, de inputs a badges.

É impossível falar sobre essa abordagem sem prestar um devido reconhecimento. Um agradecimento especial à equipe do **shadcn**, que verdadeiramente furou a bolha ao popularizar a ideia de que um Design System não precisa ser uma biblioteca de caixa-preta, mas sim um conjunto de receitas adaptáveis que vivem dentro do nosso próprio código. Da mesma forma, a inspiração para este artigo veio em grande parte do trabalho excepcional da equipe do **nuxt-labs**. Projetos como o [Nuxt UI](https://ui.nuxt.com/) são a prova viva da aplicação poderosa desses conceitos no ecossistema Nuxt, servindo como um farol para a criação de interfaces modernas e eficientes.

Espero que este guia tenha fornecido a clareza e as ferramentas para você construir seus próprios sistemas de componentes de forma mais inteligente. O código completo, com mais variações, está disponível no [repositório do projeto](https://github.com/TutorFx/article-how-to-use-tailwind-variants-with-nuxt3). Agora, vá em frente e construa interfaces incríveis.

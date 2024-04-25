---
title: O Nuxt 4 está vindo sem grandes mudanças. E isso é bom!
createdAt: 2024-04-25T00:00:00.000Z
---

Nos últimos anos, vimos uma grande evolução por parte do Nuxt, e com evolução, temos também muitas _breaking changes_.

> Mas o que esperar do Nuxt4? Nos ultimos anos, milhares de devs perderam muito cabelo migrando codebases inteiras para a _Composition API_.

Bom, se esse é seu medo, pode ficar tranquilo. O time de desenvolvimento do Nuxt agora tem como objetivo seguir o [semver](https://semver.org/lang/pt-BR/).

## O que esperar do Nuxt 4

O objetivo do Nuxt 4 não é criar hype sobre essa versão. É se manter estável e quase que completamente compatível com a versão 3. Caso você já queira se preparar para o futuro, aqui estão algumas dessas mudanças:

### Features

- Agora os subdiretórios dos `composables`, `plugins` e `middleware` serão escaneados recursivamente.

### Os deprecados

Durante os últimos anos, a atualização `Nuxt 2 → Nuxt 3` fez com que o repositório do Nuxt fosse completamente re-escrito para apresentar as mudanças absurdas de desempenho recentes. Porém, esse ano a equipe do NuxtLabs pisou no freio. E isso mostra que o Nuxt já é um Framework Fullstack maduro e pronto para diversos cenários.

- As propriedades `process.client` e `process.server` deixarão de ser suportadas.

- O `NuxtLink` irá perder os props `noPrefetch`, `noRel` e `externalRelAttribute`. No momento atual, está sendo discutido se essas props serão inclusas em um módulo, para que, se caso o usuário pretenda continuar utilizando, seja possível.

- O composable useFetch agora terá um novo recurso muito aguardado. Dentro do objeto do useFetch, agora existirá uma referência de variável com o status da response, que pode ser "idle", "pending", "success" ou "error". Já em contra-partida, o pending será removido em detrimento dessa nova adição.

- Uma outra notável mudança, é que agora o alias `params` do ofetch será removido. Então se você usa essa alias em sua codebase, está na hora de trocar para `query`.

### As _Breaking Changes_

Graças ao [NitroJS](https://nitro.unjs.io/), o Nuxt evoluiu de um "Meta-framework" para um "Fullstack-framework". E para torna-lo um pouco mais modular, haverão algumas mudanças na estrutura do diretório. Caso o utils esteja posicionado no caminho `~/utils`, ele será utilizado tanto no Backend, quanto no Frontend.

> E devo dizer. Isso será ótimo para organizar os schemas do zod!

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

### Melhorias no desempenho

- No Nuxt 3, o useFetch possui um watcher que observa referências (`ref()`). Padrão, esse observador é definido com `{ deep: true }`. Nesse caso, o deep é completamente desnecessário e consume muitos recursos do navegador.

### Para quem desenvolve módulos

- Agora o Lifecycle hook `builder:watch` irá emitir o caminho absoluto da aplicação
- O templateUtils do `@nuxt/kit` será deprecado e futuramente removido.

## O futuro do Nuxt4

Agora com a casa arrumada, a atenção se volta novamente aos módulos, como no Nuxt2...

Como a `codebase` do `Nuxt 2 → Nuxt 3` precisou ser completamente reescrita, todos os antigos módulos também estão sendo reescritos agora. Então temos em vista um cenário muito confortável, como se parecia na época de ouro do Nuxt 2. Assim como Daniel Roe disse, em sua palestra na CityJS London:

> Nosso foco será tranquilizar as pessoas de que nunca mais experimentarão algo doloroso como a migração entre `Nuxt 2 → Nuxt 3`.

E eu devo dizer, estou completamente entusiasmado com o fato de não ter que reescrever todas as _codebases_ que mantenho no momento 😂.

Acompanhe em tempo real o [progresso das atualizações do Nuxt 4](https://github.com/nuxt/nuxt/issues?q=is%3Aopen+is%3Aissue+milestone%3A4.0).

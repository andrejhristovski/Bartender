import yaml from 'js-yaml'

// Turns `import data from './recipe.md'` (or a .yml file) into a plain JS object:
//   { ...frontmatter, body: "markdown after the --- block" }
// Parsing happens at build time, so js-yaml stays out of the client bundle.
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export default function markdown() {
  return {
    name: 'recipe-markdown',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0]

      // Whole-file YAML — the cocktail list lives in one of these.
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        return { code: `export default ${JSON.stringify(yaml.load(code) || {})}`, map: null }
      }

      if (!file.endsWith('.md')) return null
      const match = FRONTMATTER.exec(code)
      const data = match ? yaml.load(match[1]) || {} : {}
      const body = (match ? match[2] : code).trim()
      return {
        code: `export default ${JSON.stringify({ ...data, body })}`,
        map: null,
      }
    },
  }
}

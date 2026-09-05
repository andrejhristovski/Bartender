import yaml from 'js-yaml'

// Turns `import data from './recipe.md'` into a plain JS object:
//   { ...frontmatter, body: "markdown after the --- block" }
// Parsing happens at build time, so js-yaml stays out of the client bundle.
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export default function markdown() {
  return {
    name: 'recipe-markdown',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null
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

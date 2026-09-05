import site from '../content/site.md'

// Every .md file in content/recipes becomes a recipe — adding a file is all it
// takes to add a recipe, which is exactly what the CMS does when it commits.
const modules = import.meta.glob('../content/recipes/*.md', { eager: true })

export const recipes = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.split('/').pop().replace(/\.md$/, ''),
    ...mod.default,
  }))
  .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))

export const getRecipe = (slug) => recipes.find((r) => r.slug === slug)

export { site }

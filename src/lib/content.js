import site from '../content/site.md'

// Every .md file in content/recipes becomes a recipe — adding a file is all it
// takes to add one, which is exactly what the CMS does when it commits.
const modules = import.meta.glob('../content/recipes/*.md', { eager: true })

const byNewestFirst = (a, b) => String(b.date || '').localeCompare(String(a.date || ''))

// Everything in the folder, newest first. Used for lookups so a link to a drink
// keeps working even when it isn't on the homepage.
export const allRecipes = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.split('/').pop().replace(/\.md$/, ''),
    ...mod.default,
  }))
  .sort(byNewestFirst)

// "Order of the drinks" in the CMS is a drag-to-reorder list of slugs. Anything
// left out of it keeps its place after the ones that were ordered by hand.
const order = Array.isArray(site.recipeOrder) ? site.recipeOrder : []
const rank = (recipe) => {
  const i = order.indexOf(recipe.slug)
  return i === -1 ? Number.MAX_SAFE_INTEGER : i
}

// The full list in the order the CMS specifies. Deep links resolve against
// this, so hiding a drink from the homepage never breaks a shared URL.
export const ordered = [...allRecipes].sort((a, b) => rank(a) - rank(b) || byNewestFirst(a, b))

// "How many to show" — blank or 0 means all of them.
const limit = Number(site.recipesToShow) || 0
export const recipes = limit > 0 ? ordered.slice(0, limit) : ordered

export const getRecipe = (slug) => allRecipes.find((r) => r.slug === slug)

export { site }

import site from '../content/site.md'
import cocktails from '../content/cocktails.yml'

// The CMS keeps every drink in one drag-to-reorder list, so the order of this
// array IS the running order — no sorting to do.
const list = Array.isArray(cocktails?.cocktails) ? cocktails.cocktails : []

// URLs come from the name. "Ember & Rye" -> "ember-and-rye", which is what the
// per-file recipes used, so links shared before the migration still resolve.
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const seen = new Map()

export const ordered = list
  .filter((drink) => drink && drink.title)
  .map((drink) => {
    const base = slugify(drink.title) || 'drink'
    const count = (seen.get(base) || 0) + 1
    seen.set(base, count)
    // Two drinks named the same would otherwise collide on one URL.
    return { ...drink, slug: count === 1 ? base : `${base}-${count}` }
  })

// Kept as an alias: a link to a drink must resolve even when "how many to show"
// is trimming it off the homepage.
export const allRecipes = ordered

const limit = Number(site.recipesToShow) || 0
export const recipes = limit > 0 ? ordered.slice(0, limit) : ordered

export const getRecipe = (slug) => ordered.find((drink) => drink.slug === slug)

export { site }

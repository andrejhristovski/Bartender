// A CMS field counts as "provided" only when it would actually render something.
// Empty strings, whitespace, empty lists and nulls all mean "leave it out".
export const has = (value) => {
  if (value === null || value === undefined || value === false) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  return true
}

// True when at least one of the values is provided — used to decide whether a
// whole section is worth rendering at all.
export const hasAny = (...values) => values.some(has)

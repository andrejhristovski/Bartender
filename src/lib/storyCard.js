// Draws a 1080×1920 story card from the same photo and copy the recipe modal
// shows, then hands it to the share sheet (phones) or saves it (desktop).
// Reached only by the easter egg in RecipeDialogV2: three quick clicks inside
// an open recipe.
import { has } from './has'

const W = 1080
const H = 1920
const PAD = 84

// Straight from tokens.css — a canvas can't read CSS custom properties.
const INK = '#efe6da'
const INK_SOFT = 'rgba(239, 230, 218, 0.72)'
const ACCENT = '#e0a260'
const LINE = 'rgba(224, 162, 96, 0.24)'
const DISPLAY = '"Instrument Serif", Georgia, serif'
const BODY = '"Figtree", system-ui, sans-serif'

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`image: ${src}`))
    img.src = src
  })

// Google Fonts load lazily; drawing before the faces arrive silently falls back
// to Times and the card looks nothing like the site.
async function ensureFonts() {
  if (!document.fonts) return
  await Promise.all([
    document.fonts.load(`110px ${DISPLAY}`),
    document.fonts.load(`400 34px ${BODY}`),
    document.fonts.load(`500 26px ${BODY}`),
  ])
}

function wrap(ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function renderStoryCard(recipe) {
  await ensureFonts()

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const inner = W - PAD * 2

  // ── photo ───────────────────────────────────────────────────────────────
  ctx.fillStyle = '#17120f'
  ctx.fillRect(0, 0, W, H)
  if (recipe.image) {
    const img = await loadImage(recipe.image)
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
  }

  // ── measure the bottom block before darkening behind it ─────────────────
  const ingredients = (recipe.ingredients || []).filter((i) => has(i?.item) || has(i?.amount))
  const blurb = has(recipe.body) ? recipe.body : recipe.description

  const ROW = 74
  ctx.font = `400 30px ${BODY}`
  const noteLines = has(blurb) ? wrap(ctx, blurb, inner) : []

  const NOTE_LEAD = 44
  let blockH = ingredients.length * ROW
  // gap down to the divider, divider down to the first baseline, then leading
  if (noteLines.length) blockH += 44 + 56 + (noteLines.length - 1) * NOTE_LEAD

  const blockTop = H - PAD - blockH

  // ── scrims ──────────────────────────────────────────────────────────────
  const top = ctx.createLinearGradient(0, 0, 0, H * 0.34)
  top.addColorStop(0, 'rgba(6,5,4,.78)')
  top.addColorStop(0.55, 'rgba(6,5,4,.22)')
  top.addColorStop(1, 'rgba(6,5,4,0)')
  ctx.fillStyle = top
  ctx.fillRect(0, 0, W, H * 0.34)

  const fadeFrom = Math.max(0, blockTop - 300)
  const bottom = ctx.createLinearGradient(0, fadeFrom, 0, H)
  bottom.addColorStop(0, 'rgba(6,5,4,0)')
  bottom.addColorStop(0.42, 'rgba(6,5,4,.62)')
  bottom.addColorStop(0.72, 'rgba(6,5,4,.9)')
  bottom.addColorStop(1, 'rgba(6,5,4,.96)')
  ctx.fillStyle = bottom
  ctx.fillRect(0, fadeFrom, W, H - fadeFrom)

  // ── name, top ───────────────────────────────────────────────────────────
  ctx.textBaseline = 'alphabetic'
  // First baseline, not the top of the box: 110px caps rise ~80px above it, so
  // this sits the title one PAD in from the top edge.
  let y = PAD + 100
  if (has(recipe.title)) {
    ctx.font = `110px ${DISPLAY}`
    ctx.fillStyle = INK
    for (const line of wrap(ctx, recipe.title, inner)) {
      ctx.fillText(line, PAD, y)
      y += 104
    }
  }

  // ── ingredients and blurb, bottom ───────────────────────────────────────
  y = blockTop
  if (ingredients.length) {
    ingredients.forEach((ing, i) => {
      y += ROW
      ctx.textAlign = 'left'
      ctx.font = `400 34px ${BODY}`
      ctx.fillStyle = INK
      if (has(ing.item)) ctx.fillText(ing.item, PAD, y - 24)
      if (has(ing.amount)) {
        ctx.textAlign = 'right'
        ctx.font = `400 28px ${BODY}`
        ctx.fillStyle = ACCENT
        ctx.fillText(ing.amount, W - PAD, y - 24)
        ctx.textAlign = 'left'
      }
      // No rule under the last row — the divider above the blurb does that job.
      if (i < ingredients.length - 1) {
        ctx.fillStyle = LINE
        ctx.fillRect(PAD, y, inner, 1)
      }
    })
  }

  if (noteLines.length) {
    y += 44
    ctx.fillStyle = LINE
    ctx.fillRect(PAD, y, inner, 1)
    y += 56
    ctx.font = `400 30px ${BODY}`
    ctx.fillStyle = INK_SOFT
    for (const line of noteLines) {
      ctx.fillText(line, PAD, y)
      y += NOTE_LEAD
    }
  }

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
  if (!blob) throw new Error('canvas')
  return blob
}

// Phones get the share sheet — that's the route straight into Instagram.
// Everything else downloads. Desktop Chrome answers canShare({files}) with
// true and would open the OS share sheet instead of saving the file, so the
// pointer check, not the API check, is what decides.
export async function saveStoryCard(recipe) {
  const blob = await renderStoryCard(recipe)
  const name = `${recipe.slug || 'cocktail'}-story.jpg`
  const file = new File([blob], name, { type: 'image/jpeg' })
  const touch = window.matchMedia?.('(pointer: coarse)').matches

  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return 'shared'
    } catch (error) {
      // A cancelled sheet is a decision, not a failure — don't then shove a
      // download at them. Anything else (iOS drops the user gesture across
      // the await) falls through and saves the file instead.
      if (error?.name === 'AbortError') return 'cancelled'
    }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}

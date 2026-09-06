// The CMS field says "handle", but people paste whatever's in their address
// bar. Accept all of it: @name, name, instagram.com/name, a full URL with
// query junk on the end. Without this, pasting a URL produced an href of
// https://instagram.com/https://instagram.com/name.
export const instagramHandle = (value) =>
  String(value || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '')

export const instagramUrl = (value) => {
  const handle = instagramHandle(value)
  return handle ? `https://instagram.com/${handle}` : null
}

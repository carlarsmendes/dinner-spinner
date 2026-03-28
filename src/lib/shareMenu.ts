import { toBlob } from 'html-to-image'
import type { ShareMenuItem } from '../types'

type ShareWeeklyMenuOptions = {
  cardNode: HTMLElement
  items: ShareMenuItem[]
}

type ShareResult =
  | { status: 'shared' }
  | { status: 'shared-text' }
  | { status: 'downloaded' }
  | { status: 'downloaded-and-copied' }
  | { status: 'copied' }
  | { status: 'cancelled' }

const SITE_URL = 'https://dinner-spinner.vercel.app/'

const buildSectionText = (title: string, items: string[]) => {
  if (items.length === 0) {
    return `${title}:\n- Open spot`
  }

  return `${title}:\n${items.map((item) => `- ${item}`).join('\n')}`
}

export const buildWeeklyMenuShareText = (items: ShareMenuItem[]) => {
  const mains = items.filter((item) => item.type === 'main').map((item) => item.mealName ?? 'Open spot')
  const soup = items.find((item) => item.type === 'soup')?.mealName ?? 'Open spot'
  const snack = items.find((item) => item.type === 'snack')?.mealName ?? 'Open spot'

  return [
    'Dinner Spinner 🍽️',
    '',
    "This week's menu:",
    '',
    buildSectionText('Main dishes', mains),
    '',
    buildSectionText('Soup', [soup]),
    '',
    buildSectionText('Snack', [snack]),
  ].join('\n')
}

const downloadImage = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard?.writeText) {
    return false
  }

  await navigator.clipboard.writeText(text)
  return true
}

const shareTextIfPossible = async (text: string) => {
  if (!navigator.share) {
    return false
  }

  const data = {
    title: 'Dinner Spinner 🍽️',
    text,
    url: SITE_URL,
  }

  await navigator.share(data)
  return true
}

const shareFileIfPossible = async (blob: Blob) => {
  if (!navigator.share || typeof File === 'undefined') {
    return false
  }

  const file = new File([blob], 'dinner-spinner-menu.png', { type: 'image/png' })
  const data = {
    title: 'Dinner Spinner 🍽️',
    files: [file],
  }

  if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
    return false
  }

  await navigator.share(data)
  return true
}

export const shareWeeklyMenu = async ({
  cardNode,
  items,
}: ShareWeeklyMenuOptions): Promise<ShareResult> => {
  const text = buildWeeklyMenuShareText(items)
  const blob = await toBlob(cardNode, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#fffaf4',
  })

  if (!blob) {
    try {
      const shared = await shareTextIfPossible(text)

      if (shared) {
        return { status: 'shared-text' }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { status: 'cancelled' }
      }
    }

    const copied = await copyToClipboard(text)
    return copied ? { status: 'copied' } : { status: 'cancelled' }
  }

  try {
    const shared = await shareFileIfPossible(blob)

    if (shared) {
      return { status: 'shared' }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: 'cancelled' }
    }
  }

  try {
    const shared = await shareTextIfPossible(text)

    if (shared) {
      return { status: 'shared-text' }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: 'cancelled' }
    }
  }

  downloadImage(blob, 'dinner-spinner-menu.png')
  const copied = await copyToClipboard(text)

  return copied ? { status: 'downloaded-and-copied' } : { status: 'downloaded' }
}

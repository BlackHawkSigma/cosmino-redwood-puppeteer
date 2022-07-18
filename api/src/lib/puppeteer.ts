import puppeteer, { BrowserContext, Browser } from 'puppeteer'

import { UserInputError } from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'
import { setTimeoutPromise as setTimeout } from 'src/utils/timers'

import { db } from './db'

const puppeteerLogger = logger.child({ name: 'browser' })

let browser: Browser | null = null

type contextStore = {
  username: string
  userpwd: string
  busy: boolean
  context: BrowserContext
}

export const contexts: Map<string, contextStore> = new Map()

export type CreateContextArgs = {
  username: string
  userpwd: string
}

const headless = process.env.PUPETEER_BROWSER_HEADLESS === 'true'

export const createContextWithUser = async ({
  username,
  userpwd,
}: CreateContextArgs): Promise<boolean> => {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      headless,
      slowMo: 20,
      defaultViewport: { width: 1280, height: 720 },
    })
    puppeteerLogger.info('gestartet')

    browser.on('disconnected', () => contexts.clear())
  } else {
    const ctx = contexts.get(username)
    if (ctx) return true
  }

  const context = await browser.createIncognitoBrowserContext()
  contexts.set(username, { username, userpwd, busy: true, context })

  // context.on('targetdestroyed', () => contexts.delete(username))

  try {
    const page = await context.newPage()
    await page.goto(process.env.COSMINO_URL)
    await Promise.all([
      page.waitForSelector('#username'),
      page.waitForSelector('#userpwd'),
    ])
    puppeteerLogger.info('seite geladen')

    await page.click('#username')
    await page.type('#username', username)
    puppeteerLogger.info('name eingetragen')

    await page.click('#userpwd')
    await page.type('#userpwd', userpwd)
    puppeteerLogger.info('passwort eingetragen')

    await Promise.all([
      page.click('#bttlist_actLogin'),
      page.waitForNavigation(),
    ])
    puppeteerLogger.info('anmeldung...')

    // Scann Fenster
    const mainFrame = await page.waitForFrame(
      async (frame) => frame.name() === 'frameMain',
      {
        timeout: 5000,
      }
    )
    await mainFrame.waitForSelector('#bttlistnav_actItemLookUp')
    puppeteerLogger.info('... angemeldet')

    await Promise.all([
      mainFrame.click('#bttlistnav_actItemLookUp'),
      mainFrame.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])

    const filterFrame = await page.waitForFrame(
      async (frame) => frame.name() === 'frameFilter'
    )
    await filterFrame.waitForSelector('#txtOpWorkItemNo')
    puppeteerLogger.info('bereit für Eingabe')

    contexts.set(username, { ...contexts.get(username), busy: false })

    return true
  } catch (err) {
    puppeteerLogger.error(err)
    context.close()
    contexts.delete(username)
    return false
  }
}

export const killContextWithUser = async (
  username: string
): Promise<boolean> => {
  const ctx = contexts.get(username)
  if (!ctx) {
    puppeteerLogger.info('kein context mehr vorhanden')
    return true
  }

  const { context } = ctx
  try {
    await context.close()
    puppeteerLogger.info('context geschlossen')
  } finally {
    contexts.delete(username)
  }
  return true
}

export type CreateBuchungArgs = {
  username: string
  code: string
}

export type CreateBuchungResult =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

export const createBuchungWithUser = async ({
  username,
  code,
}: CreateBuchungArgs): Promise<CreateBuchungResult> => {
  let ctx = contexts.get(username)

  if (!ctx) {
    const user = await db.user.findUnique({ where: { name: username } })
    if (!user) throw new UserInputError(`user "${username}" unbekannt`)
    puppeteerLogger.info('kein context gefunden, starte erneut')

    await createContextWithUser({
      username: user.name,
      userpwd: user.password,
    })
    ctx = contexts.get(username)
  }

  if (ctx && ctx.busy) {
    puppeteerLogger.info('busy, waiting...')

    await setTimeout(5000)
  }

  contexts.set(username, { ...contexts.get(username), busy: true })

  const { context } = ctx
  const pages = await context.pages()
  const page = pages[0]

  const filterFrame = await page.waitForFrame(
    async (frame) => frame.name() === 'frameFilter'
  )
  const input = await filterFrame.waitForSelector('#txtOpWorkItemNo')
  await input.type(code)
  await page.keyboard.press('Tab')

  const newWindow = await browser.waitForTarget(async (target) => {
    const page = await target.page()
    const title = await page?.title()
    return title === 'Fehlererfassung' || title === 'Scan fehlgeschlagen.'
  })

  const popupPage = await newWindow.page()
  const title = await popupPage.title()

  switch (title) {
    case 'Fehlererfassung': {
      const label = await popupPage.$eval('#lbl_inspectionobj_name', (span) =>
        span.textContent.toString()
      )
      puppeteerLogger.trace(label)

      const ioButton = await popupPage.$('button#bttlist_actwfl888')
      await ioButton.click()

      contexts.set(username, { ...contexts.get(username), busy: false })
      return { type: 'success', message: label }
    }
    case 'Scan fehlgeschlagen.': {
      const cancelButton = await popupPage.$('button#bttlist_formcancel')
      await cancelButton.click()

      contexts.set(username, { ...contexts.get(username), busy: false })
      return { type: 'error', message: 'Scan fehlgeschlagen' }
    }
  }
}

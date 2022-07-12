import { setTimeout } from 'timers/promises'

import puppeteer, { BrowserContext, Browser } from 'puppeteer'

import { UserInputError } from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

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
  terminal: string
  username: string
  userpwd: string
}

export const createContextWithUser = async ({
  terminal,
  username,
  userpwd,
}: CreateContextArgs) => {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
      defaultViewport: { width: 1280, height: 720 },
    })
    puppeteerLogger.info('gestartet')

    browser.on('disconnected', () => contexts.clear())
  } else {
    const ctx = contexts.get(terminal)
    if (ctx) return ctx.username
  }

  const context = await browser.createIncognitoBrowserContext()
  contexts.set(terminal, { username, userpwd, busy: true, context })
  // context.on('targetdestroyed', () => contexts.delete(terminal))

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

    // Scann Fenster
    const mainFrame = await page.waitForFrame(
      async (frame) => frame.name() === 'frameMain',
      {
        timeout: 5000,
      }
    )
    await mainFrame.waitForSelector('#bttlistnav_actItemLookUp')

    await Promise.all([
      mainFrame.click('#bttlistnav_actItemLookUp'),
      mainFrame.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])

    const filterFrame = await page.waitForFrame(
      async (frame) => frame.name() === 'frameFilter'
    )
    await filterFrame.waitForSelector('#txtOpWorkItemNo')

    // contexts.set(terminal, { username, userpwd, context })
    contexts.set(terminal, { ...contexts.get(terminal), busy: false })

    return `logged in as ${username}`
  } catch (err) {
    context.close()
    contexts.delete(terminal)
    return `anmeldung fehlsgeschlagen ${err}`
  }
}

export const killContextwithTerminal = async (terminal: string) => {
  const ctx = contexts.get(terminal)
  if (!ctx) return true

  const { context } = ctx
  await context.close()
  contexts.delete(terminal)

  return true
}

export type CreateBuchungArgs = {
  terminal: string
  code: string
}

export const createBuchungWithTerminal = async ({
  terminal,
  code,
}: CreateBuchungArgs) => {
  const ctx = contexts.get(terminal)

  if (!ctx) throw new UserInputError('keine Session gefunden')

  if (ctx.busy) {
    puppeteerLogger.info('busy, waiting...')

    await setTimeout(5000)
  }

  contexts.set(terminal, { ...contexts.get(terminal), busy: true })

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

      contexts.set(terminal, { ...contexts.get(terminal), busy: false })
      return label
    }
    case 'Scan fehlgeschlagen.': {
      const cancelButton = await popupPage.$('button#bttlist_formcancel')
      // await page.waitForTimeout(5000)
      await cancelButton.click()

      contexts.set(terminal, { ...contexts.get(terminal), busy: false })
      return 'Scan fehlgeschlagen'
    }
  }
}

import puppeteer, { Browser, BrowserContext, HandleFor } from 'puppeteer'

import { UserInputError } from '@redwoodjs/graphql-server'

import { emitter } from 'src/functions/graphql'
import { logger } from 'src/lib/logger'

import { db } from './db'

const puppeteerLogger = logger.child({ name: 'browser' })

let browser: Browser | null = null

type contextStore = {
  username: string
  userpwd: string
  type: 'popup' | 'direct'
  context: BrowserContext
}

export const contexts: Map<string, contextStore> = new Map()

const headless = process.env.PUPETEER_BROWSER_HEADLESS === 'true'
const slowMo = parseInt(process.env.PUPETEER_BROWSER_SLOWMO ?? '10')
const cosminoUrl = new URL(process.env.COSMINO_URL)

export type CreateContextArgs = {
  username: string
  userpwd: string
  type?: contextStore['type']
}

export const createContextWithUser = async ({
  username,
  userpwd,
  type = 'popup',
}: CreateContextArgs): Promise<boolean> => {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      headless,
      slowMo,
      defaultViewport: { width: 1280, height: 720 },
    })
    puppeteerLogger.info('gestartet')

    browser.on('disconnected', () => {
      contexts.clear()
      emitter.emit('invalidate', { type: 'CosminoSession', id: username })
    })
  } else {
    const ctx = contexts.get(username)
    if (ctx) return true
  }

  const context = await browser.createIncognitoBrowserContext()
  contexts.set(username, { username, userpwd, type, context })
  emitter.emit('invalidate', { type: 'CosminoSession', id: username })

  // context.on('targetdestroyed', () => contexts.delete(username))

  puppeteerLogger.info(`Anmeldung für ${username}. Modus: ${type}`)
  try {
    const page = await context.newPage()
    await page.goto(cosminoUrl.toString(), {
      waitUntil: 'domcontentloaded',
    })
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
      (frame) => frame.name() === 'frameMain',
      { timeout: 5_000 }
    )
    await mainFrame.waitForSelector('#bttlistnav_actItemLookUp')
    puppeteerLogger.info(`... ${username} angemeldet`)

    await Promise.all([
      mainFrame.click('#bttlistnav_actItemLookUp'),
      mainFrame.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])

    const filterFrame = await page.waitForFrame(
      (frame) => frame.name() === 'frameFilter'
    )
    await filterFrame.waitForSelector('#txtOpWorkItemNo')
    puppeteerLogger.info('bereit für Eingabe')

    return true
  } catch (err) {
    puppeteerLogger.error(err)
    try {
      await context.close()
    } finally {
      contexts.delete(username)
      emitter.emit('invalidate', { type: 'CosminoSession', id: username })
    }
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
    emitter.emit('invalidate', { type: 'CosminoSession', id: username })
  }
  return true
}

export type CreateBuchungArgs = {
  username: string
  code: string
}

export type CreateBuchungResult =
  | { type: 'success'; message: string; imageUrl: string }
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
      type: user.directMode ? 'direct' : 'popup',
    })
    ctx = contexts.get(username)
  }

  const { context } = ctx
  const pages = await context.pages()
  const page = pages[0]

  const pageURL = new URL(page.url())
  const sessionID = pageURL.searchParams.get('sid')
  puppeteerLogger.info(`sid: ${sessionID}`)

  const filterFrame = await page.waitForFrame(
    (frame) => frame.name() === 'frameFilter'
  )
  const input = await filterFrame.waitForSelector('#txtOpWorkItemNo')
  await input.type(code)
  await page.keyboard.press('Tab')

  await new Promise<void>((res) => {
    context.once('targetcreated', res)
  })

  // const newWindow = await browser.waitForTarget(
  //   (target) => {
  //     const windowURL = new URL(target.url())

  // const notFoundurl = `
  // http://srfawp0008.ad.ponet:9080/csm/uc/client/oee/online/frames/scanfield/workitem_invalid/workitem_invalid.uc
  // ?tmps=1673357210463
  // &sid=e21bb8a0.aaefb018
  // &spath=frameFilter
  // &action=init
  // &NotFoundNo=o48576934576
  // &ProcessId=696
  // &ProcessIds=696
  // `

  // const foundurl = `
  // http://srfawp0008.ad.ponet:9080/csm/uc/client/traceability/faultlocation/dispatcher.uc
  // ?tmps=1673357473462
  // &sid=e21bb8a0.aaefb018
  // &spath=frameFilter
  // &action=init
  // &WorkItemId=12781152
  // &InspObjId=159476
  // &ProcessId=696
  // `

  const newPages = await context.pages()

  const popupPage = newPages.find((page) => {
    const windowURL = new URL(page.url())

    const sid = windowURL.searchParams.get('sid')
    const NotFoundNo = windowURL.searchParams.get('NotFoundNo')
    const WorkItemId = windowURL.searchParams.get('WorkItemId')

    return (
      sid?.startsWith(sessionID) && (NotFoundNo !== null || WorkItemId !== null)
    )
  })

  const popupClosed = new Promise<void>((res) => popupPage.on('close', res))

  const title = await popupPage.title()
  switch (title) {
    case 'Fehlererfassung': {
      await popupPage.waitForSelector('#lbl_inspectionobj_name')
      const label = await popupPage.$eval('#lbl_inspectionobj_name', (span) =>
        span.textContent.toString()
      )
      puppeteerLogger.trace(label)

      const imageSrc = await popupPage.$eval('img#pic01', (img) =>
        img.getAttribute('src')
      )
      const imageUrl = `${cosminoUrl.origin}${imageSrc}`
      await page.waitForNetworkIdle()

      // "kein Prüfauftrag gefunden" dialog
      const errorDialog = await popupPage.$('div#dialog3')
      if (errorDialog) {
        await popupPage.screenshot({
          path: `logs/${username}-${code}-${new Date().valueOf()}.png`,
        })
        killContextWithUser(username)
        throw new UserInputError('kein Prüfauftrag gefunden')
      }

      const ioButton = (await popupPage.$(
        'button#bttlist_actwfl888'
      )) as HandleFor<HTMLButtonElement>
      await ioButton.click()

      await popupClosed
      await new Promise<void>((res) => {
        page.on('framenavigated', () => res())
      })

      return { type: 'success', message: label, imageUrl }
    }
    case 'Scan fehlgeschlagen.': {
      await popupPage.waitForSelector('button#bttlist_formcancel')
      const cancelButton = await popupPage.$('button#bttlist_formcancel')
      await cancelButton.click()

      await popupClosed
      await new Promise<void>((res) => {
        page.on('framenavigated', () => res())
      })

      return {
        type: 'error',
        message: 'Bearbeitungseinheit nicht gefunden!',
      }
    }
  }
}

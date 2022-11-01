import puppeteer, { BrowserContext, Browser, HandleFor } from 'puppeteer'

import { UserInputError } from '@redwoodjs/graphql-server'

import { emitter } from 'src/functions/graphql'
import AsyncLock from 'src/lib/async-lock'
import { logger } from 'src/lib/logger'
import { setTimeoutPromise } from 'src/utils/timers'

import { db } from './db'

const puppeteerLogger = logger.child({ name: 'browser' })

let browser: Browser | null = null
const lock = new AsyncLock()

type contextStore = {
  username: string
  userpwd: string
  type: 'popup' | 'direct'
  context: BrowserContext
}

export const contexts: Map<string, contextStore> = new Map()
// export const contexts: Map<string, contextStore> = new Proxy(new Map(), {
//   get(target, p) {
//     return Reflect.get(target, p)
//   },
//   set(target, name, value) {
//     emitter.emit('invalidate', { type: 'CosminoSession' })
//     console.log('CosminoSession updated')

//     return Reflect.set(target, name, value)
//   },
// })

const headless = process.env.PUPETEER_BROWSER_HEADLESS === 'true'
const cosminoUrl = new URL(process.env.COSMINO_URL)
const cosminoDirectUrl = new URL(process.env.COSMINO_DIRECT_URL)

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
      slowMo: 10,
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
  switch (type) {
    case 'popup':
      try {
        const page = await context.newPage()
        await page.goto(cosminoUrl.toString())
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
        puppeteerLogger.info(`... ${username} angemeldet`)

        await Promise.all([
          mainFrame.click('#bttlistnav_actItemLookUp'),
          mainFrame.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])

        const filterFrame = await page.waitForFrame(
          async (frame) => frame.name() === 'frameFilter'
        )
        await filterFrame.waitForSelector('#txtOpWorkItemNo')
        puppeteerLogger.info('bereit für Eingabe')

        return true
      } catch (err) {
        puppeteerLogger.error(err)
        context.close()
        contexts.delete(username)
        emitter.emit('invalidate', { type: 'CosminoSession', id: username })
        return false
      }
    case 'direct':
      try {
        const page = await context.newPage()
        await page.goto(cosminoDirectUrl.toString())
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

        await page.waitForSelector('#txtOpWorkItemNo')
        puppeteerLogger.info('bereit für Eingabe')

        return true
      } catch (err) {
        puppeteerLogger.error(err)
        context.close()
        contexts.delete(username)
        emitter.emit('invalidate', { type: 'CosminoSession', id: username })
        return false
      }
    default:
      throw new Error('unknown type')
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

  switch (ctx.type) {
    case 'popup':
      return lock.acquire<CreateBuchungResult>('cosmino', async () => {
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
            const label = await popupPage.$eval(
              '#lbl_inspectionobj_name',
              (span) => span.textContent.toString()
            )
            puppeteerLogger.trace(label)

            const imageSrc = await popupPage.$eval('img#pic01', (img) =>
              img.getAttribute('src')
            )
            const imageUrl = `${cosminoUrl.origin}${imageSrc}`
            await page.waitForNetworkIdle()

            const ioButton = (await popupPage.$(
              'button#bttlist_actwfl888'
            )) as HandleFor<HTMLButtonElement>
            await ioButton.click()
            await page.waitForNetworkIdle()
            await setTimeoutPromise(500)

            return { type: 'success', message: label, imageUrl }
          }
          case 'Scan fehlgeschlagen.': {
            const cancelButton = await popupPage.$('button#bttlist_formcancel')
            await cancelButton.click()
            await page.waitForNetworkIdle()
            await setTimeoutPromise(500)

            return {
              type: 'error',
              message: 'Bearbeitungseinheit nicht gefunden!',
            }
          }
        }
      })
    case 'direct':
      return lock.acquire<CreateBuchungResult>('cosmino', async () => {
        const { context } = ctx
        const pages = await context.pages()
        const page = pages[0]

        const input = await page.waitForSelector('#txtOpWorkItemNo')
        await input.type(code)
        await page.keyboard.press('Tab')

        const nok = async () => {
          await page.waitForSelector('#scan_visual.scan_visual_red')

          const newWindow = await browser.waitForTarget(async (target) => {
            const page = await target?.page()
            const title = await page?.title()
            return title === 'Scan fehlgeschlagen.'
          })

          const popupPage = await newWindow?.page()

          const cancelButton = await popupPage?.$('button#bttlist_formcancel')
          await cancelButton?.click()

          await page?.waitForNetworkIdle()
          await page?.waitForFunction(
            'document.querySelector("#lblMessage").innerText.length === 0'
          )

          return {
            type: 'error',
            message: 'Bearbeitungseinheit nicht gefunden!',
          }
        }

        const ok = async () => {
          await page.waitForSelector('#scan_visual.scan_visual_green')
          await page.waitForNetworkIdle()
          await page.waitForFunction(
            'document.querySelector("#lblMessage").innerText.length === 0'
          )
          return {
            type: 'success',
            message: code,
          }
        }

        return Promise.race([nok(), ok()])
      })
    default:
      throw new Error('unknown type')
  }
}

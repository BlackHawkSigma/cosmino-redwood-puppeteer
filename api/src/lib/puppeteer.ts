import puppeteer, { Browser, HandleFor } from 'puppeteer'

import { UserInputError } from '@redwoodjs/graphql-server'

import { setTimeoutPromise } from 'src/utils/timers'

import { db } from './db'

export const browserStore: Map<string, Browser> = new Map()

const headless = process.env.PUPETEER_BROWSER_HEADLESS === 'true'
const cosminoUrl = new URL(process.env.COSMINO_URL)

export const createBrowserWithUser = async ({ username }): Promise<boolean> => {
  if (browserStore.get(username)) {
    return true
  }

  try {
    const browser = await puppeteer.launch({
      headless,
      slowMo: 10,
      defaultViewport: { width: 1280, height: 720 },
    })

    browser.on('disconnected', () => {
      browserStore.delete(username)
    })

    const { password } = await db.user.findUnique({ where: { name: username } })

    const page = await browser.newPage()
    await page.goto(cosminoUrl.toString(), { waitUntil: 'networkidle2' })
    // await Promise.all([
    //   page.waitForSelector('#username'),
    //   page.waitForSelector('#userpwd'),
    // ])

    await page.click('#username')
    await page.type('#username', username)

    await page.click('#userpwd')
    await page.type('#userpwd', password)

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#bttlist_actLogin'),
    ])

    const mainFrame = await page.waitForFrame(
      async (frame) => frame.name() === 'frameMain'
    )
    await mainFrame.waitForSelector('#bttlistnav_actItemLookUp')

    await Promise.all([
      mainFrame.waitForNavigation({ waitUntil: 'networkidle2' }),
      mainFrame.click('#bttlistnav_actItemLookUp'),
    ])

    const filterFrame = await page.waitForFrame(
      async (frame) => frame.name() === 'frameFilter'
    )
    await filterFrame.waitForSelector('#txtOpWorkItemNo')

    browserStore.set(username, browser)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const killBrowserWithUser = async (
  username: string
): Promise<boolean> => {
  const browser = browserStore.get(username)
  if (!browser) {
    return true
  }

  try {
    await browser.close()
  } finally {
    browserStore.delete(username)
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
  let browser = browserStore.get(username)

  if (!browser) {
    const user = await db.user.findUnique({ where: { name: username } })
    if (!user) throw new UserInputError(`user "${username}" unbekannt`)

    await createBrowserWithUser({ username })
    browser = browserStore.get(username)
  }

  const pages = await browser.pages()
  const page = pages[1]

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
      // await filterFrame.waitForFunction(
      //   'document.querySelector("#lblMessage").innerText.length === 0'
      // )

      return { type: 'success', message: label, imageUrl }
    }
    case 'Scan fehlgeschlagen.': {
      const cancelButton = await popupPage.$('button#bttlist_formcancel')
      await cancelButton.click()
      await page.waitForNetworkIdle()
      await setTimeoutPromise(500)
      // await filterFrame.waitForFunction(
      //   'document.querySelector("#lblMessage").innerText.length === 0'
      // )

      return {
        type: 'error',
        message: 'Bearbeitungseinheit nicht gefunden!',
      }
    }
  }
}

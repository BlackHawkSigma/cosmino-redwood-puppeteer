import {
  terminals,
  // terminal,
  // createTerminal,
  // updateTerminal,
  // deleteTerminal,
} from './terminal'
import type { StandardScenario } from './terminal.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('terminals', () => {
  scenario('returns all terminals', async (scenario: StandardScenario) => {
    const result = await terminals()

    expect(result.length).toEqual(Object.keys(scenario.terminal).length)
  })

  // scenario('returns a single terminal', async (scenario: StandardScenario) => {
  //   const result = await terminal({ id: scenario.terminal.one.id })

  //   expect(result).toEqual(scenario.terminal.one)
  // })

  // scenario('creates a terminal', async () => {
  //   const result = await createTerminal({
  //     input: { name: 'String8982767' },
  //   })

  //   expect(result.name).toEqual('String8982767')
  // })

  // scenario('updates a terminal', async (scenario: StandardScenario) => {
  //   const original = await terminal({ id: scenario.terminal.one.id })
  //   const result = await updateTerminal({
  //     id: original.id,
  //     input: { name: 'String99399062' },
  //   })

  //   expect(result.name).toEqual('String99399062')
  // })

  // scenario('deletes a terminal', async (scenario: StandardScenario) => {
  //   const original = await deleteTerminal({ id: scenario.terminal.one.id })
  //   const result = await terminal({ id: original.id })

  //   expect(result).toEqual(null)
  // })
})

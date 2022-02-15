import V2EX from "../src/api"

/**
 * Dummy test
 */
describe("V2EX test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("V2EX is instantiable", () => {
    expect(new V2EX({token: 'token'})).toBeInstanceOf(V2EX)
  })

  it("getNotifications", async () => {
    const token = process.env.V2EX_TOKEN || ''
    expect(await new V2EX({token}).getNotifications()).toBeInstanceOf(Promise)
  })
})

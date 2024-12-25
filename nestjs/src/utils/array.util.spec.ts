import { filterDuplicates } from "./array.util"

describe('ArrayUtil', () => {
  const fnc = filterDuplicates
  it('should be defined', () => {
      expect(fnc).toBeDefined()
  })

  it('should return only unique values', () => {
    const arr = [1, 2, 3, 4, 5, null, null, 2, null, null]
    const expected = [1, 2, 3, 4, 5, null]
    const result = fnc( arr)
    expect(result).toEqual(expected)
  })
})

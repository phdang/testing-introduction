import { filterDuplicates } from "./array.util"

describe('ArrayUtil', () => {
  const fnc = filterDuplicates
  it('should be defined', () => {
      expect(fnc).toBeDefined()
  })

  it('should return an array', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = fnc(arr)
    expect(Array.isArray(result)).toBe(true)
  })

  it('should return an empty array if the input is an empty array', () => {
    const arr = []
    const result = fnc(arr)
    expect(result).toEqual([])
  })

  it('should return only unique values', () => {
    const arr = [1, 2, 3, 4, 5, null, null, 2, null, null]
    const expected = [1, 2, 3, 4, 5, null]
    const mockFn = jest.fn(fnc)
    mockFn(arr)
    expect(mockFn.mock.results[0].value).toEqual(expected)
    const testCase2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    mockFn(testCase2)
    expect(mockFn).toHaveBeenCalledWith(testCase2)
    expect(mockFn).toHaveBeenCalledTimes(2)
    const expected2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(mockFn.mock.results[1].value).toEqual(expected2)
  })
})

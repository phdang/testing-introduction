export function onlyUnique(value, index, array) {
  return array.indexOf(value) === index
}

export function filterDuplicates<T>(array: T[]): T[] {
  return array.filter(onlyUnique)
}

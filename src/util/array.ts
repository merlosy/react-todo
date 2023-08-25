/**
 * Split an array in 2 based on a predicate function
 * @param arr
 * @param predicate
 * @returns array of matches, array of non-matches
 */
export function partition<T>(arr: T[], predicate: (value: T) => boolean): [T[], T[]] {
  return arr.reduce((acc, val) => (acc[predicate(val) ? 0 : 1].push(val), acc), [[], []] as [T[], T[]]);
}

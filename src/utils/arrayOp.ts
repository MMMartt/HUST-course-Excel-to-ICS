export const replaceFirst = <T>(
  list: Array<T>,
  pred: (value: T, index: number) => boolean,
  replacer: T
): Array<T> => {
  const index = list.findIndex(pred)
  if (index === -1) return list
  return [
    ...list.slice(0, index),
    replacer,
    ...list.slice(index + 1, list.length),
  ]
}

export const replaceLast = <T>(
  list: Array<T>,
  pred: (value: T, index: number) => boolean,
  replacer: T
): Array<T> => {
  return replaceFirst(list.reverse(), pred, replacer).reverse()
}

/**
 * element compared by '==='
 */
export const isSameSimpleArray = <T>(a: Array<T>, b: Array<T>): boolean => {
  return a.findIndex((v, i) => b[i] !== v) < 0
}

export const extractObjectValueToList: typeof Object.values = (o: never) => {
  return Object.values(o)
}

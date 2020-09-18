export const findAllMatches = (
  str: string,
  regex: RegExp
): RegExpExecArray[] => {
  let tmp = regex.exec(str)
  const result = []
  while (tmp) {
    result.push(tmp)
    tmp = regex.exec(str)
  }
  return result
}

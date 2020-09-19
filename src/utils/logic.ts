export const fbIfFalse = <T>(expr: T, fb: T): T => {
  try {
    if (!expr) throw new Error('fallback warning')
    return expr
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error)
    return fb
  }
}

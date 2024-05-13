export const listToMap = <T>(list: T[], key: keyof T, extractKey: keyof T) => {
  if (!list) return {}
  if (!key) return {}
  return list.reduce((map, item: T) => {
    if (item[key] || item[key] === 0) {
      if (extractKey) {
        map[item[key]] = item[extractKey]
      } else {
        map[item[key]] = item
      }
    }
    return map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any)
}

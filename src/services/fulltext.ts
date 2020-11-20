import Fuse from 'fuse.js'

export const createTokenSearchIndex = <T extends any>(tokenLists: any, ...searchFields: string[]) => {
  const fuseIndex: Fuse<T> = new Fuse(tokenLists, { keys: searchFields, useExtendedSearch: true })
  return fuseIndex
}

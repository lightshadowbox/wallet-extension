import Fuse from 'fuse.js'

export const createTokenSearchIndex = (tokenLists: any, ...searchFields: string[]) => {
  const fuseIndex = new Fuse(tokenLists, { keys: searchFields })
  return fuseIndex
}

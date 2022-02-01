export type BlockPowSolutions = {
  pk: string
  w: string
  n: string
  d: number
}

export type BlockHeader = {
  timestamp: bigint
  height: number
  nBits: number
  version: number
  extensionId: string
  difficulty: string
  votes: string
  size: string
  stateRoot: string
  id: string
  adProofsRoot: string
  transactionsRoot: string
  extensionHash: string
  powSolutions: BlockPowSolutions
  adProofsId: string
  transactionsId: string
  parentId: string
}

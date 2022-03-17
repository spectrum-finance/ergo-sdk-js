export type BlockPowSolutions = {
  pk: string
  w: string
  n: string
  d: bigint
}

export type BlockHeader = {
  id: string
  parentId: string
  version: number
  timestamp: bigint
  height: number
  nBits: bigint
  votes: string
  stateRoot: string
  adProofsRoot: string
  transactionsRoot: string
  extensionHash: string
  powSolutions: BlockPowSolutions
}

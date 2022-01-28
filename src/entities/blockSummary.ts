export type BlockSummary = {
  id: string
  height: number
  epoch: number
  version: number
  timestamp: bigint
  transactionsCount: number
  miner: {
    address: string
    name: string
  }
  size: number
  difficulty: bigint
}

export type NetworkContext = {
  readonly height: number
  readonly epoch: EpochParams
}

export type EpochParams = {
  readonly height: number
  readonly storageFeeFactor: bigint
  readonly minValuePerByte: bigint
  readonly maxBlockSize: number
  readonly maxBlockCost: bigint
  readonly blockVersion: number
  readonly tokenAccessCost: bigint
  readonly inputCost: bigint
  readonly dataInputCost: bigint
  readonly outputCost: bigint
}

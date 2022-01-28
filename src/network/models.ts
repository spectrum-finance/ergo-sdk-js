import {
  AssetAmount,
  BoxId,
  ErgoBox,
  HexString,
  Input,
  Registers,
  SigmaType,
  TokenAmount,
  TokenId,
  TxId
} from "../"
import {BlockHeader} from "../entities/blockHeader"
import {BlockSummary} from "../entities/blockSummary"
import {DataInput} from "../entities/dataInput"
import {parseRegisterId} from "../entities/registers"
import {Balance} from "../wallet/entities/balance"

export type Items<T> = {
  items: T[]
  total: number
}

export type ExplorerErgoBox = {
  boxId: string
  transactionId: string
  blockId: string
  value: bigint
  index: number
  creationHeight: number
  settlementHeight: number
  ergoTree: string
  address: string
  assets: BoxAsset[]
  additionalRegisters: {[key: string]: BoxRegister}
  spentTransactionId?: string
}

export type AugErgoBox = Omit<ExplorerErgoBox, "additionalRegisters" | "blockId" | "settlementHeight"> &
  Pick<ErgoBox, "additionalRegisters">

export type ExplorerInput = Input & ExplorerErgoBox

export type AugInput = Input & AugErgoBox

export function explorerToInput(ein: ExplorerInput): AugInput {
  return {
    ...explorerToErgoBox(ein),
    spendingProof: ein.spendingProof
  }
}

export type ExplorerTokenBalance = {
  tokenId: TokenId
  amount: bigint
  decimals: number
  name?: string
}

export function fixExplorerTokenBalance(b: ExplorerTokenBalance): ExplorerTokenBalance {
  return {...b, amount: BigInt(b.amount)}
}

export function explorerTokenBalanceToTokenAmount(b: ExplorerTokenBalance): TokenAmount {
  return {tokenId: b.tokenId, amount: b.amount, name: b.name, decimals: b.decimals}
}

export type ExplorerBalance = {
  readonly nanoErgs: bigint
  readonly tokens: ExplorerTokenBalance[]
}

export function fixExplorerBalance(b: ExplorerBalance): ExplorerBalance {
  return {nanoErgs: BigInt(b.nanoErgs), tokens: b.tokens.map(t => fixExplorerTokenBalance(t))}
}

export function explorerBalanceToWallet(b: ExplorerBalance): Balance {
  const fixed = fixExplorerBalance(b)
  return new Balance(
    fixed.nanoErgs,
    new Map(fixed.tokens.map(t => [t.tokenId, AssetAmount.fromToken(explorerTokenBalanceToTokenAmount(t))]))
  )
}

export type ExplorerUnspentErgoBox = {
  id: string
  txId: string
  mainChain: boolean
  value: bigint
  index: number
  creationHeight: number
  ergoTree: string
  address: string
  assets: BoxAsset[]
  additionalRegisters: {[key: string]: BoxRegister}
  spentTransactionId?: string | null
}

// const errr = {"id":"962b8bb807115545482f8af97ba34e89bbc970b7978699ababb3a1650d94688a","height":673747,"epoch":657,"version":2,"timestamp":1643366279734,"transactionsCount":5,"miner":{"address":"88dhgzEuTXaRxf1rbqBRZ6Zbw9iigdB4PCdjyFKLrk22gnmjKcxZBe53vqJVetRa4tTNF9oowQWPp2c6","name":"wQWPp2c6"},"size":27215,"difficulty":1859476026032128,"minerReward":66000000000}
// https://api.ergoplatform.com/api/v1/blocks
export type ExplorerBlockSummary = {
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

export function explorerBlockSummaryToBlockSummary(summary: ExplorerBlockSummary): BlockSummary {
  return {
    ...summary
  }
}

export function explorerBlockSummariesToBlockSummaries(
  summaryItems: Items<ExplorerBlockSummary>
): BlockSummary[] {
  return summaryItems.items.map(explorerBlockSummaryToBlockSummary)
}

export type ExplorerBlockHeader = {
  timestamp: bigint
  height: number
  nBits: number
  version: number
  epoch: number
  difficulty: bigint
  size: number
  votes: number[]
  extensionId: string
  stateRoot: string
  id: string
  adProofsRoot: string
  transactionsRoot: string
  extensionHash: string
  powSolutions: {
    pk: string
    w: string
    n: string
    d: string
  }
  adProofsId: string
  transactionsId: string
  parentId: string
}

export function explorerBlockHeaderToBlockHeader(blockHeader: ExplorerBlockHeader): BlockHeader {
  return {
    ...blockHeader,
    difficulty: blockHeader.difficulty.toString(),
    votes: blockHeader.votes.map(voteByte => voteByte.toString(16).padStart(2, "0")).join(""),
    size: blockHeader.size.toString(),
    powSolutions: {
      ...blockHeader.powSolutions,
      d: parseInt(blockHeader.powSolutions.d, 10)
    }
  }
}

export type ExplorerErgoTx = {
  readonly id: TxId
  readonly inputs: ExplorerInput[]
  readonly dataInputs: DataInput[]
  readonly outputs: ExplorerErgoBox[]
  readonly timestamp: bigint
  readonly inclusionHeight: number
  readonly numConfirmations: number
  readonly size: number
}

export type ExplorerErgoUTx = {
  readonly id: TxId
  readonly inputs: ExplorerInput[]
  readonly dataInputs: DataInput[]
  readonly outputs: ExplorerErgoBox[]
  readonly creationTimestamp: bigint
  readonly size: number
}

export type AugErgoTx = {
  readonly id: TxId
  readonly inputs: AugInput[]
  readonly dataInputs: DataInput[]
  readonly outputs: AugErgoBox[]
  readonly timestamp?: bigint
  readonly inclusionHeight?: number
  readonly size: number
}

export function explorerToErgoTx(etx: ExplorerErgoTx): AugErgoTx {
  return {
    ...etx,
    inputs: etx.inputs.map(i => explorerToInput(i)),
    outputs: etx.outputs.map(o => explorerToErgoBox(o)),
    timestamp: BigInt(etx.timestamp)
  }
}

export function explorerUtxToErgoTx(etx: ExplorerErgoUTx): AugErgoTx {
  return {
    ...etx,
    inputs: etx.inputs.map(i => explorerToInput(i)),
    outputs: etx.outputs.map(o => explorerToErgoBox(o))
  }
}

export type AugAssetInfo = {
  readonly id: TokenId
  readonly boxId: BoxId
  readonly emissionAmount: bigint
  readonly name?: string
  readonly decimals?: number
  readonly description?: string
}

export function fixAssetInfo(asset: AugAssetInfo): AugAssetInfo {
  return {...asset, emissionAmount: BigInt(asset.emissionAmount)}
}

export type BoxAsset = {
  tokenId: string
  index: number
  amount: bigint
  name?: string
  decimals?: number
}

export function fixBoxAsset(asset: BoxAsset): BoxAsset {
  return {...asset, amount: BigInt(asset.amount)}
}

export type BoxRegister = {
  serializedValue: string
  sigmaType: SigmaType
  renderedValue: string
}

export type BoxSearch = {
  ergoTreeTemplateHash: HexString
  assets: TokenId[]
}

export type BoxAssetsSearch = {
  ergoTreeTemplateHash: HexString
  assets: TokenId[]
}

export function explorerToErgoBox(box: ExplorerErgoBox): AugErgoBox {
  const registers: Registers = {}
  Object.entries(box.additionalRegisters).forEach(([k, v]) => {
    const regId = parseRegisterId(k)
    if (regId) registers[regId] = v.serializedValue
  })
  return {
    boxId: box.boxId,
    transactionId: box.transactionId,
    index: box.index,
    ergoTree: box.ergoTree,
    address: box.address,
    creationHeight: box.creationHeight,
    value: BigInt(box.value), // fix possibly `number` fields to `bigint` only.
    assets: box.assets.map(a => fixBoxAsset(a)),
    additionalRegisters: registers,
    spentTransactionId: box.spentTransactionId
  }
}

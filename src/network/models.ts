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

export type AugErgoTx = {
  readonly id: TxId
  readonly inputs: AugInput[]
  readonly dataInputs: DataInput[]
  readonly outputs: AugErgoBox[]
  readonly timestamp: bigint
  readonly inclusionHeight: number
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

import {BoxId, ErgoBox, HexString, Input, Registers, SigmaType, TokenId, TxId} from "../"
import {parseRegisterId} from "../entities/registers"
import {DataInput} from "../entities/dataInput"

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

export type ExplorerErgoTx = {
  readonly id: TxId
  readonly inputs: ExplorerInput[]
  readonly dataInputs: DataInput[]
  readonly outputs: ExplorerErgoBox[]
  readonly size: number
}

export type AugErgoTx = {
  readonly id: TxId
  readonly inputs: AugInput[]
  readonly dataInputs: DataInput[]
  readonly outputs: AugErgoBox[]
  readonly size: number
}

export function explorerToErgoTx(etx: ExplorerErgoTx): AugErgoTx {
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
  let registers: Registers = {}
  Object.entries(box.additionalRegisters).forEach(([k, v]) => {
    let regId = parseRegisterId(k)
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
    assets: box.assets.map(a => ({...a, amount: BigInt(a.amount)})),
    additionalRegisters: registers,
    spentTransactionId: box.spentTransactionId
  }
}

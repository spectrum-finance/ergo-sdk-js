import {BoxId, TxId} from "../types"
import {ContextExtension} from "./contextExtension"
import {ErgoTree} from "./ergoTree"
import {Registers} from "./registers"
import {TokenAmount, tokenAmountFromProxy, TokenAmountProxy, tokenAmountToProxy} from "./tokenAmount"

export type UnsignedInput = {
  readonly boxId: BoxId
  readonly transactionId: TxId
  readonly index: number
  readonly ergoTree: ErgoTree
  readonly creationHeight: number
  readonly value: bigint
  readonly assets: TokenAmount[]
  readonly additionalRegisters: Registers
  readonly extension: ContextExtension
}

export type UnsignedInputProxy = {
  readonly boxId: BoxId
  readonly transactionId: TxId
  readonly index: number
  readonly ergoTree: ErgoTree
  readonly creationHeight: number
  readonly value: string
  readonly assets: TokenAmountProxy[]
  readonly additionalRegisters: Registers
  readonly extension: ContextExtension
}

export function unsignedInputFromProxy(proxy: UnsignedInputProxy): UnsignedInput {
  return {
    ...proxy,
    value: BigInt(proxy.value),
    assets: proxy.assets.map(a => tokenAmountFromProxy(a))
  }
}

export function unsignedInputToProxy(input: UnsignedInput): UnsignedInputProxy {
  return {
    ...input,
    value: input.value.toString(),
    assets: input.assets.map(a => tokenAmountToProxy(a))
  }
}

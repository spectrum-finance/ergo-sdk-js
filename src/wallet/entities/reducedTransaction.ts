import {BlockHeader} from "../../entities/blockHeader"
import {NetworkContext} from "../../entities/networkContext"
import {txRequestToWasmTransaction} from "../../ergoWasmInterop"
import {HexString} from "../../types"
import {toHex} from "../../utils/hex"
import {SigmaRust} from "../../utils/rustLoader"
import {TxRequest} from "./txRequest"

export type ReducedTransaction = HexString

export function reduceTx(
  txr: TxRequest,
  lastBlocks: BlockHeader[],
  ctx: NetworkContext,
  wasm: SigmaRust
): ReducedTransaction {
  const headers = wasm.BlockHeaders.from_json(lastBlocks.slice(0, 10))
  const preHeader = wasm.PreHeader.from_block_header(headers.get(0))
  const ergoCtx = new wasm.ErgoStateContext(preHeader, headers)
  const unsignedTx = txRequestToWasmTransaction(txr, ctx)
  const inputs = wasm.ErgoBoxes.from_boxes_json(txr.inputs.inputs)
  const dataInputs = wasm.ErgoBoxes.from_boxes_json(txr.dataInputs)
  const rtx = wasm.ReducedTransaction.from_unsigned_tx(unsignedTx, inputs, dataInputs, ergoCtx)
  return toHex(rtx.sigma_serialize_bytes())
}

import {Address} from "../../entities/address"
import {DataInput} from "../../entities/dataInput"
import {ErgoBox} from "../../entities/ergoBox"
import {ErgoBoxCandidate} from "../../entities/ergoBoxCandidate"
import {NetworkContext} from "../../entities/networkContext"
import {ergoBoxesFromWasmUtx, txRequestToWasmTransaction} from "../../ergoWasmInterop"
import {BoxSelection} from "./boxSelection"

export type TxRequest = {
  readonly inputs: BoxSelection
  readonly dataInputs: DataInput[]
  readonly outputs: ErgoBoxCandidate[]
  readonly changeAddress: Address
  readonly feeNErgs?: bigint
}

export function extractOutputsFromTxRequest(txr: TxRequest, ctx: NetworkContext): ErgoBox[] {
  return ergoBoxesFromWasmUtx(txRequestToWasmTransaction(txr, ctx))
}

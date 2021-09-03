import {BoxSelection} from "./boxSelection"
import {DataInput} from "../../entities/dataInput"
import {ErgoBoxCandidate} from "../../entities/ergoBoxCandidate"
import {Address} from "../../entities/address"

export type TxRequest = {
  readonly inputs: BoxSelection
  readonly dataInputs: DataInput[]
  readonly outputs: ErgoBoxCandidate[]
  readonly changeAddress: Address
  readonly feeNErgs?: bigint
}

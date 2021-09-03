import {ProverResult} from "./proverResult"
import {BoxId} from "../types"

export type Input = {
  readonly boxId: BoxId
  readonly spendingProof: ProverResult
}

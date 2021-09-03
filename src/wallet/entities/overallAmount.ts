import {TokenAmount} from "../../entities/tokenAmount"

export type OverallAmount = {
  nErgs: bigint
  assets: TokenAmount[]
}

import {TokenAmount} from "../../entities/tokenAmount"

export type ChangeBox = {
  readonly value: bigint
  readonly assets: TokenAmount[]
}

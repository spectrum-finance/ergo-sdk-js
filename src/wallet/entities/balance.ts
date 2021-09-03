import {TokenId} from "../../types"
import {AssetAmount} from "../../entities/assetAmount"

export class Balance {
  readonly nErgs: bigint
  readonly tokens: Map<TokenId, AssetAmount>

  constructor(nErgs: bigint, tokens: Map<TokenId, AssetAmount>) {
    this.nErgs = nErgs
    this.tokens = tokens
  }

  of(tokenId: TokenId): AssetAmount | undefined {
    return this.tokens.get(tokenId)
  }
}

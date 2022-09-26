import {AssetInfo, NativeAssetInfo} from "./assetInfo"
import {TokenAmount} from "./tokenAmount"

export class AssetAmount {
  constructor(public readonly asset: AssetInfo, public readonly amount: bigint) {
  }

  static fromToken(token: TokenAmount): AssetAmount {
    return new this(
      {
        id: token.tokenId,
        name: token.name,
        decimals: token.decimals
      },
      token.amount
    )
  }

  static native(amount: bigint): AssetAmount {
    return new this(NativeAssetInfo, amount)
  }

  withAmount(amount: bigint): AssetAmount {
    return new AssetAmount(this.asset, amount)
  }

  toToken(): TokenAmount {
    return {tokenId: this.asset.id, amount: this.amount}
  }
}

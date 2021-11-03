import axios, {AxiosInstance} from "axios"
import {Address, BoxId, ErgoTree, HexString, TokenId, TxId} from "../"
import {NetworkContext} from "../entities/networkContext"
import * as network from "../network/models"
import {JSONBI} from "../utils/json"
import {
  AugAssetInfo,
  AugErgoBalance,
  AugErgoBox,
  AugErgoTx,
  BoxAssetsSearch,
  BoxSearch,
  ExplorerErgoBalance,
  ExplorerErgoBox,
  ExplorerErgoTx,
  explorerToErgoBalance,
  explorerToErgoBox,
  explorerToErgoTx,
  fixAssetInfo
} from "./models"
import {Paging} from "./paging"
import {Sorting} from "./sorting"

export interface ErgoNetwork {
  /** Get confirmed transaction by id.
   */
  getTx(id: TxId): Promise<AugErgoTx | undefined>

  /** Get confirmed output by id.
   */
  getOutput(id: BoxId): Promise<AugErgoBox | undefined>

  /** Get balance by address.
   */
  getBalanceByAddress(address: Address): Promise<AugErgoBalance | undefined>

  /** Get transactions by address.
   */
  getTxsByAddress(address: Address, paging: Paging): Promise<[AugErgoTx[], number]>

  /** Get unconfirmed transactions by address.
   */
  getUTxsByAddress(address: Address, paging: Paging): Promise<[AugErgoTx[], number]>

  /** Get unspent boxes with a given ErgoTree.
   */
  getUnspentByErgoTree(tree: ErgoTree, paging: Paging): Promise<[AugErgoBox[], number]>

  /** Get unspent boxes with scripts matching a given template hash.
   */
  getUnspentByErgoTreeTemplate(hash: HexString, paging: Paging): Promise<AugErgoBox[]>

  /** Get unspent boxes containing a token with given id.
   */
  getUnspentByTokenId(tokenId: TokenId, paging: Paging, sort?: Sorting): Promise<AugErgoBox[]>

  /** Get boxes containing a token with given id.
   */
  getByTokenId(tokenId: TokenId, paging: Paging, sort?: Sorting): Promise<AugErgoBox[]>

  /** Get unspent boxes by a given hash of ErgoTree template.
   */
  getUnspentByErgoTreeTemplateHash(hash: HexString, paging: Paging): Promise<[AugErgoBox[], number]>

  /** Detailed search among unspent boxes.
   */
  searchUnspentBoxes(req: BoxSearch, paging: Paging): Promise<[AugErgoBox[], number]>

  /** Search among unspent boxes by ergoTreeTemplateHash and tokens..
   */
  searchUnspentBoxesByTokensUnion(req: BoxAssetsSearch, paging: Paging): Promise<[AugErgoBox[], number]>

  /** Get a token info by id.
   */
  getFullTokenInfo(tokenId: TokenId): Promise<AugAssetInfo | undefined>

  /** Get all available tokens.
   */
  getTokens(paging: Paging): Promise<[AugAssetInfo[], number]>

  /** Get current network context.
   */
  getNetworkContext(): Promise<NetworkContext>
}

export class Explorer implements ErgoNetwork {
  readonly backend: AxiosInstance

  constructor(uri: string) {
    this.backend = axios.create({
      baseURL: uri,
      timeout: 5000,
      headers: {"Content-Type": "application/json"}
    })
  }

  async getTx(id: TxId): Promise<AugErgoTx | undefined> {
    return this.backend
      .request<ExplorerErgoTx>({
        url: `/api/v1/transactions/${id}`,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => explorerToErgoTx(res.data))
  }

  async getOutput(id: BoxId): Promise<AugErgoBox | undefined> {
    return this.backend
      .request<ExplorerErgoBox>({
        url: `/api/v1/boxes/${id}`,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => explorerToErgoBox(res.data))
  }

  async getBalanceByAddress(address: Address): Promise<AugErgoBalance | undefined> {
    return this.backend
      .request<ExplorerErgoBalance>({
        url: `/api/v1/addresses/${address}/balance/confirmed`,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => explorerToErgoBalance(res.data))
  }

  async getTxsByAddress(address: Address, paging: Paging): Promise<[AugErgoTx[], number]> {
    return this.backend
      .request<network.Items<ExplorerErgoTx>>({
        url: `/api/v1/addresses/${address}/transactions`,
        params: paging,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(tx => explorerToErgoTx(tx)), res.data.total])
  }

  async getUTxsByAddress(address: Address, paging: Paging): Promise<[AugErgoTx[], number]> {
    return this.backend
      .request<network.Items<ExplorerErgoTx>>({
        url: `/api/v1/mempool/transactions/byAddress/${address}`,
        params: paging,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(tx => explorerToErgoTx(tx)), res.data.total])
  }

  async getUnspentByErgoTree(tree: ErgoTree, paging: Paging): Promise<[AugErgoBox[], number]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/unspent/byErgoTree/${tree}`,
        params: paging,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(b => network.explorerToErgoBox(b)), res.data.total])
  }

  async getUnspentByErgoTreeTemplate(templateHash: HexString, paging: Paging): Promise<AugErgoBox[]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/unspent/byErgoTreeTemplateHash/${templateHash}`,
        params: paging,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => res.data.items.map(b => network.explorerToErgoBox(b)))
  }

  async getUnspentByTokenId(tokenId: TokenId, paging: Paging, sort?: Sorting): Promise<AugErgoBox[]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/unspent/byTokenId/${tokenId}`,
        params: {...paging, sortDirection: sort || "asc"},
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => res.data.items.map(b => network.explorerToErgoBox(b)))
  }

  async getByTokenId(tokenId: TokenId, paging: Paging, sort?: Sorting): Promise<AugErgoBox[]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/byTokenId/${tokenId}`,
        params: {...paging, sortDirection: sort || "asc"},
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => res.data.items.map(b => network.explorerToErgoBox(b)))
  }

  async getUnspentByErgoTreeTemplateHash(hash: HexString, paging: Paging): Promise<[AugErgoBox[], number]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/unspent/byErgoTreeTemplateHash/${hash}`,
        params: paging,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(b => network.explorerToErgoBox(b)), res.data.total])
  }

  async searchUnspentBoxes(req: BoxSearch, paging: Paging): Promise<[AugErgoBox[], number]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/unspent/search`,
        params: paging,
        method: "POST",
        data: req,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(b => network.explorerToErgoBox(b)), res.data.total])
  }

  async searchUnspentBoxesByTokensUnion(
    req: BoxAssetsSearch,
    paging: Paging
  ): Promise<[AugErgoBox[], number]> {
    return this.backend
      .request<network.Items<network.ExplorerErgoBox>>({
        url: `/api/v1/boxes/unspent/search/union`,
        params: paging,
        method: "POST",
        data: req,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(b => network.explorerToErgoBox(b)), res.data.total])
  }

  async getFullTokenInfo(tokenId: TokenId): Promise<AugAssetInfo | undefined> {
    return this.backend
      .request<AugAssetInfo>({
        url: `/api/v1/tokens/${tokenId}`,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => (res.status != 404 ? fixAssetInfo(res.data) : undefined))
  }

  async getTokens(paging: Paging): Promise<[AugAssetInfo[], number]> {
    return this.backend
      .request<network.Items<AugAssetInfo>>({
        url: `/api/v1/tokens`,
        params: paging,
        transformResponse: data => JSONBI.parse(data)
      })
      .then(res => [res.data.items.map(a => fixAssetInfo(a)), res.data.total])
  }

  async getNetworkContext(): Promise<NetworkContext> {
    return this.backend
      .request<NetworkContext>({
        url: `/api/v1/epochs/params`
      })
      .then(res => res.data)
  }
}

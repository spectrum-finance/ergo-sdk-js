import {Input} from "ergo-lib-wasm-browser"
import {BoxSelection, TxRequest} from "../.."
import {Address} from "../../entities/address"
import {BlockHeader} from "../../entities/blockHeader"
import {ErgoBoxProxy, ergoBoxToProxy} from "../../entities/ergoBox"
import {ErgoTxProxy} from "../../entities/ergoTx"
import {unsignedErgoTxFromProxy, UnsignedErgoTxProxy} from "../../entities/unsignedErgoTx"
import * as wasm from "../../ergoWasmInterop"
import {Explorer} from "../../network/ergoNetwork"
import {Paging} from "../../network/paging"
import {BoxId, NErg, TokenId, TxId} from "../../types"
import {Balance} from "../entities/balance"

// See https://github.com/Emurgo/Emurgo-Research/blob/master/ergo/EIP-0012.md
export interface ErgoAPI {
  request_read_access: () => Promise<boolean>

  check_read_access: () => boolean

  get_utxos: (amount?: NErg, token_id?: TokenId, paginate?: Paging) => Promise<ErgoBoxProxy[] | undefined>

  get_balance: (token_id: TokenId) => Promise<string>

  get_used_addresses: (paginate?: Paging) => Promise<Address[]>

  get_unused_addresses: () => Promise<Address[]>

  sign_tx: (tx: UnsignedErgoTxProxy) => Promise<ErgoTxProxy>

  sign_tx_input: (tx: UnsignedErgoTxProxy, index: number) => Promise<Input>

  sign_data: (addr: Address, message: string) => Promise<string>

  submit_tx: (tx: ErgoTxProxy) => Promise<TxId>

  add_external_box: (box_id: BoxId) => boolean
}

export class ErgoPayBridge implements ErgoAPI {
  private readonly explorer: Explorer = new Explorer("https://api.ergoplatform.com")
  constructor(private address: string) {}

  public async get_utxos(
    amount?: bigint | undefined,
    token_id = "ERG",
    paginate: Paging = {offset: 0, limit: 100}
  ): Promise<ErgoBoxProxy[] | undefined> {
    console.log("get_utxos", {token_id, amount, paginate})
    const availableUtxos = await this.explorer.getUnspentBoxesByAddress(this.address, paginate)
    return availableUtxos.map(ergoBoxToProxy)
  }

  public async request_read_access(): Promise<boolean> {
    return true
  }

  public check_read_access(): boolean {
    return true
  }

  public async get_balance(token_id: string): Promise<string> {
    console.log("get_balance", {token_id})
    const confirmedBalance: Balance =
      (await this.explorer.getBalanceByAddress(this.address)) ?? new Balance(0n, new Map())
    if (token_id === "ERG") {
      return confirmedBalance.nErgs.toString()
    }
    return confirmedBalance.of(token_id)?.amount.toString() ?? "0"
  }

  public async get_used_addresses(paginate?: Paging | undefined): Promise<string[]> {
    console.log("get_used_addresses", {paginate})
    return [this.address]
  }

  public async get_unused_addresses(): Promise<string[]> {
    console.log("get_unused_addresses")
    return []
  }

  public async sign_tx(tx: UnsignedErgoTxProxy): Promise<ErgoTxProxy> {
    console.log("sign_tx", JSON.stringify(tx))

    const ergoNetworkContext = await this.explorer.getNetworkContext()
    const maybeBlockHeaders = await this.explorer.getBlockHeaders()
    if (maybeBlockHeaders.some(h => !h)) throw new Error("Couldn't get block headers for ergo state")
    const blockHeaders = maybeBlockHeaders as unknown as BlockHeader[]
    const ergoStateContext = wasm.blockHeadersToErgoStateContext(blockHeaders)

    const txNonProxy = unsignedErgoTxFromProxy(tx)
    // This is for EIP-0019 requesting, different from EIP-0012
    const req: TxRequest = {
      inputs: BoxSelection.make(txNonProxy.inputs) as BoxSelection,
      outputs: txNonProxy.outputs,
      dataInputs: txNonProxy.dataInputs,
      changeAddress: this.address
    }

    const reducedTx = wasm.txRequestToWasmReducedTx(req, ergoStateContext, ergoNetworkContext)

    // ErgoPay implementation has 'urlsafe' base64 expectation where `+,/` are replaced with `-,_`
    const reducedTxSafeBase64 = Buffer.from(reducedTx.sigma_serialize_bytes())
      .toString("base64")
      .replaceAll("+", "-")
      .replaceAll("/", "_")
    const reducedTxErgoPayUri = `ergopay:${reducedTxSafeBase64}`
    console.log(reducedTxErgoPayUri)

    throw new Error("not implemented")
  }
  public async sign_tx_input(tx: UnsignedErgoTxProxy, index: number): Promise<Input> {
    console.log("sign_tx_input", JSON.stringify({tx, index}))
    throw new Error("not implemented")
  }
  public async sign_data(addr: string, message: string): Promise<string> {
    console.log("sign_data", JSON.stringify({addr, message}))
    throw new Error("not implemented")
  }
  public async submit_tx(tx: ErgoTxProxy): Promise<string> {
    console.log("submit_tx", JSON.stringify(tx))
    throw new Error("not implemented")
  }
  public add_external_box(box_id: string): boolean {
    console.log("add_external_box", JSON.stringify({box_id}))
    throw new Error("not implemented")
  }
}

// Something like this is doable but perhaps ill advised
// export const ergoPayToYoroi = ((window as any).ergo = new ErgoPayBridge(
//   "88dhgzEuTXaVfva5U9pvg84LryFq6umpt3ZpaUt63yDLcHydKsEHaXbebCbnKsprU5PW3G2GqX8ZdmUM" // Random address pulled from explorer front page for illustration
// ))

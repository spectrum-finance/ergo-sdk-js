import {HexString} from "../types"
import {RustModule} from "../utils/rustLoader"
import {Address} from "./address"

export type ErgoTree = HexString

export function ergoTreeFromAddress(addr: Address): ErgoTree {
  return RustModule.SigmaRust.Address.from_base58(addr).to_ergo_tree().to_base16_bytes()
}

export function ergoTreeToBytea(ergoTree: ErgoTree): Uint8Array {
  return RustModule.SigmaRust.ErgoTree.from_base16_bytes(ergoTree).sigma_serialize_bytes()
}

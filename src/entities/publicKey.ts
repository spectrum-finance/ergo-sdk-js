import {HexString} from "../types"
import {Address, AddressKind, kindOfAddress} from "./address"
import * as bs58 from "bs58"

export type PublicKey = HexString

/** Construct `PublicKey` from address
 *  @return - `PublicKey` in case given address is P2PK, `undefined` otherwise.
 */
export function publicKeyFromAddress(address: Address): PublicKey | undefined {
  let addressRaw = bs58.decode(address)
  let pk = addressRaw.slice(1, 34).toString("hex")
  return kindOfAddress(address) === AddressKind.P2PK ? pk : undefined
}

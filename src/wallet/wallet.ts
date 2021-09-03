import {Prover} from "./prover"
import {Balance} from "./entities/balance"
import {Address} from "../entities/address"

export interface Wallet extends Prover {
  /** Get total ergo balance.
   */
  getBalance(): Promise<Balance>

  /** Get change address.
   */
  getChangeAddress(): Promise<Address>

  /** Get ergo addresses.
   * @param unused - show only unused addresses
   */
  getAddresses(unused: boolean): Promise<Address[]>
}

import {ErgoTx} from "../entities/ergoTx"
import {Input} from "../entities/input"
import {UnsignedErgoTx} from "../entities/unsignedErgoTx"

export interface Prover {
  /** Sign the given transaction.
   */
  sign(tx: UnsignedErgoTx): Promise<ErgoTx>

  /** Sign particular input of the given transaction.
   */
  signInput(tx: UnsignedErgoTx, input: number): Promise<Input>
}

import {InsufficientInputs} from "../errors/insufficientInputs"
import {BoxSelection} from "./entities/boxSelection"
import {OverallAmount} from "./entities/overallAmount"

export interface InputSelector {
  /** Get inputs satisfying the specified target amount..
   */
  select(target: OverallAmount): BoxSelection | InsufficientInputs
}

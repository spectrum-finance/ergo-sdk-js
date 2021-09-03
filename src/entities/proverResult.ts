import {ContextExtension} from "./contextExtension"

export type ProverResult = {
  readonly proof: Uint8Array
  readonly extension: ContextExtension
}

export const EmptyProverResult: ProverResult = {
  proof: new Uint8Array(),
  extension: {}
}

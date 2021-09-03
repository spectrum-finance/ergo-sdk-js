import {RustModule} from "../utils/rustLoader"
import {HexString} from "../types"
import {ErgoTree} from "./ergoTree"
import {toHex} from "../utils/hex"

export type ErgoTreeTemplate = HexString

export function treeTemplateFromErgoTree(tree: ErgoTree): ErgoTreeTemplate {
  return toHex(RustModule.SigmaRust.ErgoTree.from_base16_bytes(tree).template_bytes())
}

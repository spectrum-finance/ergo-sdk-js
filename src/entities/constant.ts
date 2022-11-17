import {Constant as WasmConstant} from "ergo-lib-wasm-browser"
import {SigmaPropConstPrefixHex} from "../constants"
import {HexString} from "../types"
import {RustModule} from "../utils/rustLoader"
import {PublicKey} from "./publicKey"

export class Int32Constant {
  constructor(public readonly value: number) {}
}

export class Int64Constant {
  constructor(public readonly value: bigint) {}
}

export class ByteaConstant {
  constructor(public readonly value: Uint8Array) {}
}

export class Int32ArrayConstant {
  constructor(public readonly value: Int32Array) {}
}

export class SigmaPropConstant {
  constructor(public readonly value: PublicKey) {}
}

export type Constant = Int32Constant | Int64Constant | ByteaConstant | Int32ArrayConstant | SigmaPropConstant

export function serializeConstant(c: Constant): HexString {
  let constant: WasmConstant
  if (c instanceof Int32Constant) constant = RustModule.SigmaRust.Constant.from_i32(c.value)
  else if (c instanceof Int64Constant)
    constant = RustModule.SigmaRust.Constant.from_i64(RustModule.SigmaRust.I64.from_str(c.value.toString()))
  else if (c instanceof Int32ArrayConstant) constant = RustModule.SigmaRust.Constant.from_i32_array(c.value)
  else if (c instanceof SigmaPropConstant)
    constant = RustModule.SigmaRust.Constant.decode_from_base16(SigmaPropConstPrefixHex + c.value)
  else constant = RustModule.SigmaRust.Constant.from_byte_array(c.value)
  return constant.encode_to_base16()
}

export function deserializeConstant(r: HexString): Constant | undefined {
  const constant = RustModule.SigmaRust.Constant.decode_from_base16(r)
  try {
    return new Int32Constant(constant.to_i32())
  } catch (e) {
    try {
      return new Int64Constant(BigInt(constant.to_i64().to_str()))
    } catch (e) {
      const hex = constant.encode_to_base16()
      const prefix = hex.slice(0, SigmaPropConstPrefixHex.length)
      if (prefix === SigmaPropConstPrefixHex) {
        return new SigmaPropConstant(hex.slice(SigmaPropConstPrefixHex.length))
      } else {
        try {
          return new Int32ArrayConstant(constant.to_i32_array())
        } catch (e) {
          try {
            return new ByteaConstant(constant.to_byte_array())
          } catch (e) {
            return undefined
          }
        }
      }
    }
  }
}

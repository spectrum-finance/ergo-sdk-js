import {HexString} from "../types"

export function fromHex(s: HexString): Uint8Array {
  return Uint8Array.from(Buffer.from(s, "hex"))
}

export function toHex(arr: Uint8Array): HexString {
  return Buffer.from(arr).toString("hex")
}

import {HexString} from "../types"
import {Constant, serializeConstant} from "./constant"

export enum RegisterId {
  R4 = "R4",
  R5 = "R5",
  R6 = "R6",
  R7 = "R7",
  R8 = "R8",
  R9 = "R9"
}

export function parseRegisterId(s: string): RegisterId | undefined {
  switch (s) {
    case "R4":
      return RegisterId.R4
    case "R5":
      return RegisterId.R5
    case "R6":
      return RegisterId.R6
    case "R7":
      return RegisterId.R7
    case "R8":
      return RegisterId.R8
    case "R9":
      return RegisterId.R9
  }
  return undefined
}

export type Registers = {[key: string]: HexString}

export const EmptyRegisters: Readonly<Registers> = {}

export const AdditionalRegisters = [4, 5, 6, 7, 8, 9]

export function registers(regs: [RegisterId, Constant][]): Registers {
  const acc: Registers = {}
  for (const [id, value] of regs) acc[id] = serializeConstant(value)
  return acc
}

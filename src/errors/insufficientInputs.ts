export class InsufficientInputs {
  readonly message: string

  constructor(details: string) {
    this.message = `Insufficient inputs: ${details}`
  }
}

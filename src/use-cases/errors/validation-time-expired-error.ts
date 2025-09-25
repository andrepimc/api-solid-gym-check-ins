export class ValidationTimeExpiredError extends Error {
  constructor() {
    super('Validation time expired.')
  }
}
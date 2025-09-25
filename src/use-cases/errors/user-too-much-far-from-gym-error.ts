export class UserTooMuchFarFromGymError extends Error {
  constructor() {
    super('User too much far from gym.')
  }
}
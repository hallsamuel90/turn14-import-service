/**
 * Error for when there is an issue communicating with the message broker.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class AmpqProError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

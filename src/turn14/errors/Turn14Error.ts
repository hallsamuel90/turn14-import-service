/**
 * Error for when there is an issue communicating with the turn14 api.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class Turn14Error extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

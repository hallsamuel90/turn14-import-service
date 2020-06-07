/**
 * Error for when there is an issue communicating with the woocommerce api.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

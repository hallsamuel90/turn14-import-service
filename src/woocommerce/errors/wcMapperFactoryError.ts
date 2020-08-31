/**
 * Error for when there is getting a new WcMapper from the factory.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcMapperFactoryError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

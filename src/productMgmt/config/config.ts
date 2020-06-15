import containerConfig from './container';
import subscriberConfig from './subscriber';

/**
 * Main configuration file for the product management module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  containerConfig();
  subscriberConfig();
};

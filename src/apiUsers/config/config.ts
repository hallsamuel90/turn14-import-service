import containerConfig from './container';
import subscriberConfig from './subscriber';

/**
 * Main configuration file for the apiUsers module.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default (): void => {
  containerConfig();
  subscriberConfig();
};

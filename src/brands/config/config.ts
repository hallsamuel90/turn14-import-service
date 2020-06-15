import containerConfig from './container';
import subscriberConfig from './subscriber';

export default (): void => {
  containerConfig();
  subscriberConfig();
};

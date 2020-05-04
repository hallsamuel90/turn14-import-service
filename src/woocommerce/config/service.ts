import { Container } from 'typedi';
import { WcMappingService } from '../services/wcMappingService';

export default (): void => {
  Container.get(WcMappingService);
};

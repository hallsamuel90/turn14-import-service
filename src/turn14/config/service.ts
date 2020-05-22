import { Container } from 'typedi';
import { BrandMappingService } from '../services/brandMappingService';

export default (): void => {
  Container.get(BrandMappingService);
};

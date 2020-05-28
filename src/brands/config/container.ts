import { Container } from 'typedi';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { BrandMapper } from '../services/brandMapper';
import { BrandsService } from '../services/brandsService';

export default (): void => {
  const turn14RestApiProvider = Container.get(Turn14RestApiProvider);
  const brandMapper = Container.get(BrandMapper);
  const brandsPublisher = Container.get(BrandsPublisher);

  Container.set(
    BrandsService,
    new BrandsService(turn14RestApiProvider, brandMapper, brandsPublisher)
  );
};

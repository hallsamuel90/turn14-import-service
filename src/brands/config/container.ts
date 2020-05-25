import { Container } from 'typedi';
import { BrandMapper } from '../services/brandMapper';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { BrandsService } from '../services/brandsService';
import { Turn14RestApiFactory } from '../../turn14/clients/turn14RestApiFactory';

export default (): void => {
  const turn14RestApiFactory = Container.get(Turn14RestApiFactory);
  const brandMapper = Container.get(BrandMapper);
  const brandsPublisher = Container.get(BrandsPublisher);

  Container.set(
    BrandsService,
    new BrandsService(turn14RestApiFactory, brandMapper, brandsPublisher)
  );
};

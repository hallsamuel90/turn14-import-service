import { Container } from 'typedi';
import { Turn14RestApiProvider } from '../../turn14/clients/turn14RestApiProvider';
import { AmqpProJson } from '../../util/ampqPro/ampqProJson';
import { ApiUserSequence } from '../jobs/apiUserSequence';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { BrandMapper } from '../services/brandMapper';
import { BrandsService } from '../services/brandsService';

export default (): void => {
  Container.get(Turn14RestApiProvider);
  Container.get(BrandMapper);

  const amqpProJson = Container.get(AmqpProJson);
  Container.set(BrandsPublisher, new BrandsPublisher(amqpProJson));

  Container.get(BrandsService);
  Container.get(ApiUserSequence);
};

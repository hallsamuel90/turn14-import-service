import 'reflect-metadata';
import { Container } from 'typedi';
import { RegistrationSequence } from '../jobs/registrationSequence';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { ApiUserService } from '../services/apiUser';
import { BrandsService } from '../services/brands';
import { PmgmtService } from '../services/pmgmt';
import turn14ServiceConfig from '../turn14/config/service';
import wooCommerceServiceConfig from '../woocommerce/config/service';

export default (): void => {
  wooCommerceServiceConfig();
  turn14ServiceConfig();

  Container.get(BrandsPublisher);

  Container.get(ApiUserService);
  Container.get(PmgmtService);
  Container.get(BrandsService);

  Container.get(RegistrationSequence);
};

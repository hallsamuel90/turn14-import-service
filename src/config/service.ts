import 'reflect-metadata';
import { Container } from 'typedi';
import { ImportBrandsSequence } from '../jobs/importBrandsSequence';
import { RegistrationSequence } from '../jobs/registrationSequence';
import { BrandsPublisher } from '../publishers/brandsPublisher';
import { ImportPublisher } from '../publishers/importPublisher';
import { ApiUserService } from '../services/apiUser';
import { BrandsService } from '../services/brands';
import { ImportService } from '../services/import';
import turn14ServiceConfig from '../turn14/config/service';
import wooCommerceServiceConfig from '../woocommerce/config/service';

export default (): void => {
  wooCommerceServiceConfig();
  turn14ServiceConfig();

  Container.get(BrandsPublisher);
  Container.get(ImportPublisher);

  Container.get(ApiUserService);
  Container.get(ImportService);
  Container.get(BrandsService);

  Container.get(RegistrationSequence);
  Container.get(ImportBrandsSequence);
};

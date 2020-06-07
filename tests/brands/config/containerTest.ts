import { expect } from 'chai';
import 'reflect-metadata';
import Container from 'typedi';
import brandsContainerConfig from '../../../src/brands/config/container';
import { ApiUserSequence } from '../../../src/brands/jobs/apiUserSequence';
import { BrandsPublisher } from '../../../src/brands/publishers/brandsPublisher';
import { BrandMapper } from '../../../src/brands/services/brandMapper';
import { BrandsService } from '../../../src/brands/services/brandsService';
import { Turn14RestApiProvider } from '../../../src/turn14/clients/turn14RestApiProvider';

describe('Brands Container tests', () => {
  describe('#brandContainerConfig', () => {
    beforeEach(() => {
      Container.reset();
    });

    it('should add a Turn14RestApiProvider to the Container', () => {
      brandsContainerConfig();

      expect(Container.has(Turn14RestApiProvider)).to.be.true;
    });

    it('should add a BrandMapper to the Container', () => {
      brandsContainerConfig();

      expect(Container.has(BrandMapper)).to.be.true;
    });

    it('should add a BrandsPublisher to the Container', () => {
      brandsContainerConfig();

      expect(Container.has(BrandsPublisher)).to.be.true;
    });

    it('should add a BrandsService to the Container', () => {
      brandsContainerConfig();

      expect(Container.has(BrandsService)).to.be.true;
    });

    it('should add a ApiUserSequence to the Container', () => {
      brandsContainerConfig();

      expect(Container.has(ApiUserSequence)).to.be.true;
    });
  });
});

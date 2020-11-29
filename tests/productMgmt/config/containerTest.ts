import { expect } from 'chai';
import 'reflect-metadata';
import Container from 'typedi';
import { ApiUserService } from '../../../src/apiUsers/services/apiUserService';
import { BrandsService } from '../../../src/brands/services/brandsService';
import productMgmtContainerConfig from '../../../src/productMgmt/config/container';
import { ProductMgmtService } from '../../../src/productMgmt/services/productMgmtService';
import { WcMapperFactory } from '../../../src/productMgmt/services/wcMapperFactory';
import { BrandActivationSequence } from '../../../src/productMgmt/subscribers/brandActivationSequence';
import { Turn14RestApiProvider } from '../../../src/turn14/clients/turn14RestApiProvider';
import { AmqpProJson } from '../../../src/util/ampqPro/ampqProJson';
import { WcRestApiProvider } from '../../../src/woocommerce/clients/wcRestApiProvider';

describe('Product Management Container tests', () => {
  describe('#productMgmtContainerConfig', () => {
    beforeEach(() => {
      Container.reset();
    });

    it('should add a Turn14RestApiProvider to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(Turn14RestApiProvider)).to.be.true;
    });

    it('should add a WcRestApiProvider to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(WcRestApiProvider)).to.be.true;
    });

    it('should add a ApiUserService to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(ApiUserService)).to.be.true;
    });

    it('should add a ProductMgmtService to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(ProductMgmtService)).to.be.true;
    });

    it('should add a BrandsService to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(BrandsService)).to.be.true;
    });

    it('should add a WcMapperProvider to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(WcMapperFactory)).to.be.true;
    });

    it('should add a BrandActivationSequence to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(BrandActivationSequence)).to.be.true;
    });

    it('should add a AmqpProJson to the Container', () => {
      productMgmtContainerConfig();

      expect(Container.has(AmqpProJson)).to.be.true;
    });
  });
});

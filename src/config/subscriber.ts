import Container from 'typedi';
import { ImportSubscriber } from '../subscribers/importSubscriber';
import { RegistrationSubscriber } from '../subscribers/registrationSubscriber';

export default (): void => {
  const importSubscriberService = Container.get(ImportSubscriber);
  importSubscriberService.subscribeImportBrandsSequence();

  const registrationSubscriberService = Container.get(RegistrationSubscriber);
  registrationSubscriberService.subscribeRegistrationSequence();
};

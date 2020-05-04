import ImportSubscriber from '../subscribers/importSubscriber';
import RegistrationSubscriber from '../subscribers/registrationSubscriber';

export default (): void => {
  const importSubscriber = new ImportSubscriber();
  importSubscriber.subscribeImportBrandsSequence();

  const registrationSubscriber = new RegistrationSubscriber();
  registrationSubscriber.subscribeRegistrationSequence();
};

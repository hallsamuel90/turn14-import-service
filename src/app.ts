import dotenv from 'dotenv';
import expressAppConfig from './config/expressApp';
import mongoConfig from './config/mongoose';
import serviceConfig from './config/service';
import subscriberConfig from './config/subscriber';

// load env variables
dotenv.config();

serviceConfig();
mongoConfig();
subscriberConfig();

const app = expressAppConfig();
app.listen(process.env.PORT || '8081');

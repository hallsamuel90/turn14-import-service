import mongoose from 'mongoose';
import sleep from '../util/sleep';

/**
 * Connects to the mongo instance using. Retries at a set interval if the
 * connection attempt fails.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export default async function connect(): Promise<void> {
  const RECONNECT_INTERVAL = 5;
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.info('successfully connected to mongo');
  } catch (e) {
    console.error('🔥 error: ' + e);

    console.log('💪 Retrying in ' + RECONNECT_INTERVAL + ' seconds...');
    await sleep(RECONNECT_INTERVAL * 1000);

    await connect();
  }
}

/**
 *
 */
export async function disconnect(): Promise<void> {
  await mongoose.disconnect();
}

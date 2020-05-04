import mongoose from 'mongoose';

/**
 *
 */
export default async function load(): Promise<void> {
  const RECONNECT_INTERVAL = 5;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.error('🔥 error: ' + e);
    console.log('💪 Retrying in ' + RECONNECT_INTERVAL + ' seconds...');
    setTimeout(() => {
      load();
    }, RECONNECT_INTERVAL * 1000);
  }
}

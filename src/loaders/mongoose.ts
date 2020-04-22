import mongoose from 'mongoose';

export default (): void => {
  console.log(process.env.MONGODB_URI);
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
};

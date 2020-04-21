import mongoose from 'mongoose';
import { ApiUser } from '../interfaces/iApiUser';

const ApiUserModel = new mongoose.Schema({
  siteUrl: {
    type: String,
    unique: true,
  },
  turn14Keys: {
    client: String,
    secret: String,
  },
  wcKeys: {
    client: String,
    secret: String,
  },
  brandIds: [{ type: String }],
});

export default mongoose.model<ApiUser>('ApiUser', ApiUserModel);

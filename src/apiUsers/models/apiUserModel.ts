import mongoose from 'mongoose';
import { ApiUser } from './apiUser';

const ApiUserModel = new mongoose.Schema({
  userId: String,
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

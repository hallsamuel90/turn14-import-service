import { Document } from 'mongoose';
/**
 * ApiUser interface
 */
export interface ApiUser extends Document {
  userId: string;
  siteUrl: string;
  turn14Keys: Keys;
  wcKeys: Keys;
  brandIds: string[];
}

export interface Keys {
  client: string;
  secret: string;
}

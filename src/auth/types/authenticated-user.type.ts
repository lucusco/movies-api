import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Request } from 'express';

export type AuthenticatedUser = Omit<User, 'passwordHash'> & {
  _id: Types.ObjectId;
};

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

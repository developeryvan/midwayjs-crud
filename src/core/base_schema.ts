import { Types } from 'mongoose';
export abstract class BaseSchema {
  public _id?: Types.ObjectId;
  public createdAt?: Date;
  public updatedAt?: Date;
  public save?: () => Promise<this>;
}

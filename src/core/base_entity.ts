import { Types } from 'mongoose';
export abstract class BaseEntity {
  public _id?: Types.ObjectId;
  public createdAt?: Date;
  public updatedAt?: Date;
  public save?: () => Promise<this>;
}

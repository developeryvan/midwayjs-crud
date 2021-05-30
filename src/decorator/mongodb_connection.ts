import { saveClassMetadata, saveModule } from '@midwayjs/decorator';
const MONGODB_CONNECTION_KEY = 'mongodb_connection_key';
export function MongodbConnection(connectionName: string): ClassDecorator {
  return target => {
    saveModule(MONGODB_CONNECTION_KEY, target);
    saveClassMetadata(MONGODB_CONNECTION_KEY, { connectionName }, target);
  };
}

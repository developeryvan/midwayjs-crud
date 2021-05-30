import { saveClassMetadata, saveModule } from '@midwayjs/decorator';
const CONNECTION_NAME_KEY = 'connectionNameKey';
export function ConnectionName(connectionName: string): ClassDecorator {
  return target => {
    saveModule(CONNECTION_NAME_KEY, target);
    saveClassMetadata(CONNECTION_NAME_KEY, { connectionName }, target);
  };
}

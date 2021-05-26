import { Autoload, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { NacosConfigClient as nacosConfigClient } from 'nacos';
@Autoload()
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Nacos {
  private config = {};
  @Config('nacosClient') private nacosConfig;
  @Init() protected async init(): Promise<void> {
    const { dataId, group } = this.nacosConfig;
    const nacosClient = new nacosConfigClient(this.nacosConfig);
    await nacosClient.ready();
    const configStr = await nacosClient.getConfig(dataId, group);
    this.config = configStr && JSON.parse(configStr);
    this.config && console.log(`nacos: config (${group}:${dataId}) is loaded!`);
  }
  public getConfig(name: string) {
    return this.config[name];
  }
}

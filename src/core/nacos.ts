import { Config, Init, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { NacosConfigClient as nacosConfigClient } from 'nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export default class Nacos {
  config = {};
  @Logger() logger: ILogger;
  @Config('nacosClient') nacosConfig;
  @Init() async init(): Promise<void> {
    const { dataId, group } = this.nacosConfig;
    const nacosClient = new nacosConfigClient(this.nacosConfig);
    await nacosClient.ready();
    const configStr = await nacosClient.getConfig(dataId, group);
    this.config = JSON.parse(configStr);
    this.logger.info(`nacos: config (${dataId}) is loaded!`);
  }
  public getConfig(name: string) {
    return this.config[name];
  }
}

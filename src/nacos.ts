import { IMidwayApplication } from '@midwayjs/core';
import { App, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { createConsoleLogger } from '@midwayjs/logger';
import { NacosConfigClient } from 'nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Nacos {
  @App() private readonly app: IMidwayApplication;
  @Config('nacosClient') private readonly nacosConfig;
  @Init()
  public async init(): Promise<void> {
    try {
      const { dataId, group } = this.nacosConfig;
      const nacosClient = new NacosConfigClient(this.nacosConfig);
      await nacosClient.ready();
      const configStr = await nacosClient.getConfig(dataId, group);
      const config = configStr ? JSON.parse(configStr) : {};
      this.app.addConfigObject(config);
    } catch (error) {
      createConsoleLogger('bootstrapConsoleLogger').error(error);
    }
  }
}

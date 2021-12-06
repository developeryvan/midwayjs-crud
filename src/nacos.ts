import { IMidwayApplication } from '@midwayjs/core';
import { App, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { NacosConfigClient } from 'nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Nacos {
  @App() private readonly app: IMidwayApplication;
  @Config('nacosClient') private readonly nacosClientConfig;
  private config;
  @Init()
  public async init(): Promise<void> {
    const { dataId, group } = this.nacosClientConfig;
    const nacosClient = new NacosConfigClient(this.nacosClientConfig);
    await nacosClient.ready();
    const configStr = await nacosClient.getConfig(dataId, group);
    this.config = configStr ? JSON.parse(configStr) : {};
    this.app.addConfigObject(this.config);
  }
  public getConfig() {
    return this.config;
  }
}

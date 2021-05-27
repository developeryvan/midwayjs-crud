import { App, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { IMidwayApplication } from '@midwayjs/core';
import { NacosConfigClient } from 'nacos';
@Scope(ScopeEnum.Singleton)
@Provide()
export class Nacos {
  @Config('nacosClient') private nacosConfig;
  @App() private app: IMidwayApplication;
  @Init() protected async init(): Promise<void> {
    const { dataId, group } = this.nacosConfig;
    const nacosClient = new NacosConfigClient(this.nacosConfig);
    await nacosClient.ready();
    const configStr = await nacosClient.getConfig(dataId, group);
    const remoteConfig = configStr && JSON.parse(configStr);
    this.app.addConfigObject(remoteConfig);
  }
}

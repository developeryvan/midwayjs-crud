import { App, Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { Application } from '@midwayjs/koa';
import { NacosConfigClient } from 'nacos';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Nacos {
  @App()
  private app: Application;

  private config;

  @Config('nacosClient')
  private nacosClientConfig;

  @Init()
  public async init(): Promise<void> {
    try {
      const { dataId, group } = this.nacosClientConfig;
      const nacosClient = new NacosConfigClient(this.nacosClientConfig);
      await nacosClient.ready();
      const configStr = await nacosClient.getConfig(dataId, group);
      this.config = configStr ? JSON.parse(configStr) : {};
      this.app.addConfigObject(this.config);
    } catch (error) {
      this.app.getCoreLogger().error(error);
    }
  }

  public getConfig() {
    return this.config;
  }
}

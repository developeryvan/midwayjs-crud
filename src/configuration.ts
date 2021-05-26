import { join } from 'path';

import { App, Configuration, MidwayFrameworkType } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { Application as SocketApplication } from '@midwayjs/socketio';
@Configuration({ importConfigs: [join(__dirname, './config')], conflictCheck: true })
export class ContainerLifeCycle implements ILifeCycle {
  @App() app: Application;
  @App(MidwayFrameworkType.WS_IO) socketApp: SocketApplication;
  async onReady() {
    this.socketApp.on('connection', socket => {
      console.log(socket.id);
    });
  }
}

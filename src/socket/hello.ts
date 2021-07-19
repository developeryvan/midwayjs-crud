import { WSController, OnWSMessage, Provide, OnWSConnection, Inject, WSEmit } from '@midwayjs/decorator';
import { Context } from '@midwayjs/socketio';
@Provide()
@WSController('/')
export class HelloSocketController {
  @Inject() ctx: Context;
  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id);
  }
  @OnWSMessage('greet') @WSEmit('greetResult') async gotMessage(data1, data2, data3) {
    return { name: 'harry', result: data1 + data2 + data3 };
  }
}

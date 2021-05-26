const WebFramework = require('@midwayjs/web').Framework;
const SocketFramework = require('@midwayjs/socketio').Framework;
const web = new WebFramework().configure({ port: 7001 });
const socket = new SocketFramework().configure({});
const { Bootstrap } = require('@midwayjs/bootstrap');
Bootstrap.load(web).load(socket).run();

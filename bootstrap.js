const { Bootstrap } = require('@midwayjs/bootstrap');
const { Framework } = require('@midwayjs/web');
const web = new Framework().configure({ port: 7001 });
Bootstrap.load(web)
  .before(async container => {
    await container.getAsync('nacos');
  })
  .run();

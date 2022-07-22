import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1658459941573_8296',
  koa: {
    port: 7001,
  },
  orm: {
    /**
     * 单数据库实例
     */
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'midway_vue_demo',
    synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: false,
  },
  jwt: {
    secret: 'SDFSDFASDFASDFASDFSADFASDFASDF', // fs.readFileSync('xxxxx.key')
    expiresIn: '2d', // https://github.com/vercel/ms
  },
} as MidwayConfig;

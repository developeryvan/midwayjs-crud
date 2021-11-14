import { EggPlugin } from 'egg';
export default {
  cors: { enable: true, package: 'egg-cors' },
  logrotator: false,
  static: false,
  view: false,
} as EggPlugin;

import { Provide } from '@midwayjs/decorator';

import { BaseService } from '../core/base_service';
import { Repository } from '../model/repository';
import request from '../util/request';
@Provide()
export class RepositoryService extends BaseService<Repository> {
  constructor() {
    super('main', Repository);
  }
  async fetch({ q, order = 'desc' }) {
    const perPage = 100;
    let page = 1;
    let pages = 1;
    while (page <= pages) {
      const { body } = await request({
        url: `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=${order}&per_page=${perPage}&page=${page}`,
        headers: {
          'accept': 'application/vnd.github.v3+json',
          'user-agent': 'octokit-core.js/3.4.0 Node.js/14.15.3 (win32; x64)',
          'authorization': 'token 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',
        },
      });
      try {
        const bodyJson = JSON.parse(body);
        pages = bodyJson.total_count / perPage < 10 ? bodyJson.total_count / perPage : 10;
        const list = bodyJson.items.map(item => ({
          updateOne: {
            filter: { name: item.full_name },
            update: { language: item.language, name: item.full_name, url: item.html_url, description: item.description, star: item.stargazers_count, lastPushedAt: item.pushed_at },
            upsert: true,
          },
        }));
        await this.model.bulkWrite(list);
        await new Promise(resolve => setTimeout(resolve, 1000 * 10));
        page++;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

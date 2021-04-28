import { Provide } from '@midwayjs/decorator';

import { BaseService } from '../core/base_service';
import { Repository } from '../model/repository';
import request from '../util/request';
@Provide()
export class RepositoryService extends BaseService<Repository> {
  constructor() {
    super('main', Repository);
  }
  async request(url: string, retry = 3) {
    try {
      const { body } = await request({
        url,
        headers: {
          'accept': 'application/vnd.github.v3+json',
          'user-agent': 'octokit-core.js/3.4.0 Node.js/14.15.3 (win32; x64)',
          'authorization': 'token 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',
        },
      });
      const bodyJson = JSON.parse(body);
      if (bodyJson.message) {
        retry = 0;

        throw { message: bodyJson.message };
      } else {
        return bodyJson;
      }
    } catch (error) {
      if (retry) {
        retry--;
        await new Promise(resolve => setTimeout(resolve, 1000 * 10));
        return this.request(url, retry);
      } else {
        throw error;
      }
    }
  }
  async fetch({ keyword, order = 'desc' }) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    while (page <= pages) {
      const res = await this.request(`https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&order=${order}&per_page=${pageSize}&page=${page}`);
      pages = res.total_count / pageSize < 1000 / pageSize ? res.total_count / pageSize : 1000 / pageSize;
      console.log(res.total_count);
      if (res.items?.length > 0) {
        const list = res.items.map(item => {
          const { full_name: name, html_url: url, description, language, stargazers_count: star, pushed_at: lastPushedAt } = item;
          return { updateOne: { filter: { name }, update: { type: 'repository', keyword, name, url, description, language, star, lastPushedAt }, upsert: true } };
        });
        await this.model.bulkWrite(list);
        await new Promise(resolve => setTimeout(resolve, 1000 * 10));
        page++;
      } else {
        return;
      }
    }
    console.log('done');
    const result = await this.model.find({ keyword });
    return result;
  }
  async fetchByCode({ keyword }) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    // const res = await this.request(`https://api.github.com/search/code?q=${encodeURIComponent(keyword)}&per_page=${pageSize}&page=${page}`);
    // console.log(res.total_count);
    while (page <= pages) {
      const res = await this.request(`https://api.github.com/search/code?q=${encodeURIComponent(keyword)}&per_page=${pageSize}&page=${page}`);
      console.log(res.total_count);
      pages = res.total_count / pageSize < 1000 / pageSize ? res.total_count / pageSize : 1000 / pageSize;
      if (res.items?.length > 0) {
        const list = await Promise.all(
          res.items.map(async item => {
            const { full_name: name, html_url: url, description } = item.repository;
            const { language, star, lastPushedAt } = await this.fetchOne({ name });
            return { updateOne: { filter: { name }, update: { type: 'code', keyword, name, url, description, language, star, lastPushedAt }, upsert: true } };
          })
        );
        await this.model.bulkWrite(list);
        await new Promise(resolve => setTimeout(resolve, 1000 * 10));
        page++;
      } else {
        break;
      }
    }
    console.log('done');
    const result = await this.model.find({ keyword });
    return result;
  }
  async fetchOne({ name }) {
    const { html_url: url, description, language, stargazers_count: star, pushed_at: lastPushedAt } = await this.request(`https://api.github.com/repos/${name}`);
    return { name, url, description, language, star, lastPushedAt };
  }
}

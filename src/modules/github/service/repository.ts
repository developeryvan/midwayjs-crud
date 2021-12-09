import { HttpService } from '@midwayjs/axios';
import { Inject, Provide, Task } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import { GithubRepository, GithubRepositoryModel } from '../model/repository';
@Provide()
export class GithubRepositoryService extends BaseService<GithubRepository> {
  @Inject() private readonly axios: HttpService;
  @InjectEntityModel(GithubRepository) protected model: GithubRepositoryModel;
  @Task({ repeat: { cron: '* * * * * *' } }) public async exec() {
    await this.fetch({ keyword: 'language:typescript stars:>10000', order: 'asc' });
    await this.fetchByCode({ keyword: 'sub_filter filename:nginx extension:conf' });
  }
  public async fetch({ keyword, order = 'desc' }) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    while (page <= pages) {
      const res = await this.request(`https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&order=${order}&per_page=${pageSize}&page=${page}`);
      pages = res.total_count / pageSize < 1000 / pageSize ? res.total_count / pageSize : 1000 / pageSize;
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
    const result = await this.model.find({ keyword });
    return result;
  }
  public async fetchByCode({ keyword }) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    while (page <= pages) {
      const res = await this.request(`https://api.github.com/search/code?q=${encodeURIComponent(keyword)}&per_page=${pageSize}&page=${page}`);
      pages = res.total_count / pageSize < 1000 / pageSize ? res.total_count / pageSize : 1000 / pageSize;
      if (res.items?.length > 0) {
        const list = await Promise.all(
          res.items.map(async item => {
            const { full_name: name, html_url: url, description } = item.repository;
            try {
              const { language, star, lastPushedAt } = await this.fetchOne({ name });
              return { updateOne: { filter: { name }, update: { type: 'code', keyword, name, url, description, language, star, lastPushedAt }, upsert: true } };
            } catch (error) {
              return { updateOne: { filter: { name }, update: { type: 'code', keyword, name, url, description }, upsert: true } };
            }
          })
        );
        await this.model.bulkWrite(list);
        await new Promise(resolve => setTimeout(resolve, 1000 * 10));
        page++;
      } else {
        return;
      }
    }
    const result = await this.model.find({ keyword });
    return result;
  }
  private async fetchOne({ name }) {
    const { html_url: url, description, language, stargazers_count: star, pushed_at: lastPushedAt } = await this.request(`https://api.github.com/repos/${name}`);
    return { name, url, description, language, star, lastPushedAt };
  }
  private async request(url: string, retry = 3) {
    try {
      const { data } = await this.axios.request({
        url,
        headers: {
          'accept': 'application/vnd.github.v3+json',
          'user-agent': 'octokit-core.js/3.4.0 Node.js/14.15.3 (win32; x64)',
          'authorization': 'token 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',
        },
        timeout: 5000,
        validateStatus: () => true,
      });
      if (data.message) {
        retry = 0;
        throw { message: data.message };
      } else {
        return data;
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
}

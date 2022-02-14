import { Init, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { BaseService } from '../../../core/base_service';
import request from '../../../util/request';
import { GithubRepository, GithubRepositoryModel } from '../model/repository';

@Provide()
export class GithubRepositoryService extends BaseService<GithubRepository> {
  @InjectEntityModel(GithubRepository)
  protected model: GithubRepositoryModel;

  @Init()
  public async init(): Promise<void> {
    // this.fetchAll('decorator', 10);
    // this.fetchByCode('controller path:decorator extension:ts');
  }

  public async fetchAll(keyword: string, minStar = 0) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    let totalCount = 0;
    do {
      console.log(page, minStar);
      const { total_count, items } = await this.request(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          `${keyword} stars:>${minStar}`
        )}&sort=stars&order=asc&per_page=${pageSize}&page=${page}`
      );
      pages = total_count < 1000 ? Math.ceil(total_count / pageSize) : Math.ceil(1000 / pageSize);
      totalCount = total_count;
      if (!items?.length) {
        break;
      }
      const list = items.map(({ full_name: name, html_url: url, description, language, stargazers_count: star, pushed_at: lastPushedAt }, index) => {
        if (total_count > 1000 && page === pages && index + 1 === items?.length) {
          minStar = star - 1;
        }
        return {
          updateOne: {
            filter: { name },
            update: { type: 'repository', keyword, name, url, description, language, star, lastPushedAt },
            upsert: true,
          },
        };
      });
      await this.model.bulkWrite(list);
      await new Promise(resolve => setTimeout(resolve, 1000 * 60));
      page++;
    } while (page <= pages);
    if (totalCount > 1000) {
      return this.fetchAll(keyword, minStar);
    }
    console.log('done');
  }

  public async fetchByCode(keyword: string) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    do {
      console.log(page);
      const { total_count, items } = await this.request(
        `https://api.github.com/search/code?q=${encodeURIComponent(keyword)}&per_page=${pageSize}&page=${page}`
      );
      pages = total_count < 1000 ? Math.ceil(total_count / pageSize) : Math.ceil(1000 / pageSize);
      if (!total_count || !items?.length) {
        break;
      }
      const list = await Promise.all(
        items.map(async item => {
          const { full_name: name, html_url: url, description } = item.repository;
          return { updateOne: { filter: { name }, update: { type: 'code', keyword, name, url, description }, upsert: true } };
          // try {
          //   const { language, star, lastPushedAt } = await this.fetchOne(name);
          //   return {
          //     updateOne: {
          //       filter: { name },
          //       update: { type: 'code', keyword, name, url, description, language, star, lastPushedAt },
          //       upsert: true,
          //     },
          //   };
          // } catch (error) {
          //   return { updateOne: { filter: { name }, update: { type: 'code', keyword, name, url, description }, upsert: true } };
          // }
        })
      );
      await this.model.bulkWrite(list);
      await new Promise(resolve => setTimeout(resolve, 1000 * 2));
      page++;
    } while (page <= pages);
    console.log('done');
  }

  private async fetchOne(name: string) {
    const {
      html_url: url,
      description,
      language,
      stargazers_count: star,
      pushed_at: lastPushedAt,
    } = await this.request(`https://api.github.com/repos/${name}`);
    return { name, url, description, language, star, lastPushedAt };
  }

  private async request(url: string, retry = 3) {
    try {
      // todo: token在https://github.com/settings/tokens获取
      const token = '****';
      const { data } = await request({
        url,
        headers: {
          'accept': 'application/vnd.github.v3+json',
          'user-agent': 'octokit-core.js/3.4.0 Node.js/14.15.3 (win32; x64)',
          'authorization': `token ${token}`,
        },
        timeout: 10000,
        validateStatus: () => true,
      });
      if (data.message) {
        retry = 0;
        throw new Error(data.message);
      } else {
        return data;
      }
    } catch (error) {
      if (retry) {
        await new Promise(resolve => setTimeout(resolve, 1000 * 2));
        return this.request(url, retry - 1);
      } else {
        throw error;
      }
    }
  }
}

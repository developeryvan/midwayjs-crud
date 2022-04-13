import { Inject, Provide } from '@midwayjs/decorator';
import { GithubRepository, PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { BaseService } from '../../../core/base_service';
import request from '../../../util/request';
import { Sql } from '../../../util/sql';

@Provide()
export class GithubRepositoryService extends BaseService<GithubRepository> {
  @Inject('prisma')
  private prismaClient: PrismaClient;

  @Inject()
  private sql: Sql;

  protected get model() {
    return this.prismaClient.githubRepository;
  }

  public async fetchAll(repositoryKeyword = '', minStar = 1000) {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    do {
      const { total_count: totalCount, items } = await this.request(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          `${repositoryKeyword} stars:>${minStar}`,
        )}&sort=stars&order=asc&per_page=${pageSize}&page=${page}`,
      );
      console.log(page, totalCount, minStar, new Date().toLocaleString());
      pages = totalCount < 1000 ? Math.ceil(totalCount / pageSize) : Math.ceil(1000 / pageSize);
      if (!totalCount || !items?.length) {
        break;
      }
      const list = items.map((element, index) => {
        const {
          full_name: name,
          html_url: url,
          description,
          language,
          stargazers_count: star,
          pushed_at: lastPushedAt,
        } = element;
        if (totalCount > 1000 && page === pages && index + 1 === items.length) {
          minStar = star - 1;
        }
        return [
          name,
          url,
          description || '',
          language || '',
          star,
          dayjs(lastPushedAt).format('YYYY-MM-DD HH:mm:ss'),
          /[\u4e00-\u9fa5]/.test(description),
          repositoryKeyword,
        ];
      });
      await this.sql.bulkUpdate(
        'github_repository',
        ['name', 'url', 'description', 'language', 'star', 'lastPushedAt', 'isCn', 'repositoryKeyword'],
        list,
      );
      page++;
    } while (page <= pages);
    if (pages === 10) {
      return this.fetchAll(repositoryKeyword, minStar);
    }
    console.log('done');
  }

  public async fetchByCode(codeKeyword: string, order = 'desc') {
    const pageSize = 100;
    let page = 1;
    let pages = 1;
    do {
      const { total_count: totalCount, items } = await this.request(
        `https://api.github.com/search/code?q=${encodeURIComponent(
          codeKeyword,
        )}&per_page=${pageSize}&page=${page}&sort=indexed&order=${order}`,
      );
      console.log(page, totalCount, new Date().toLocaleString());
      pages = totalCount < 1000 ? Math.ceil(totalCount / pageSize) : Math.ceil(1000 / pageSize);
      if (!totalCount || !items?.length) {
        break;
      }
      const list = await Promise.all(
        items.map(async (item) => {
          const { html_url: codeHtmlUrl, path: codePath, name: codeName } = item;
          const { full_name: name, html_url: url, description } = item.repository;
          request({
            url: codeHtmlUrl.replace('github.com', 'raw.githubusercontent.com').replace('blob/', ''),
            responseType: 'arraybuffer',
          }).then(async (res) => {
            await mkdir(join(this.app.getAppDir(), 'download', codePath.replace(codeName, '')), { recursive: true });
            writeFile(join(this.app.getAppDir(), 'download', codePath.replace(codeName, ''), codeName), res.data);
          });
          return [name, url, description || '', /[\u4e00-\u9fa5]/.test(description), codeKeyword];
        }),
      );
      await this.sql.bulkUpdate('github_repository', ['name', 'url', 'description', 'isCn', 'codeKeyword'], list);
      page++;
    } while (page <= pages);
    console.log('done');
  }

  public async fetchOne(name: string) {
    const {
      html_url: url,
      description,
      language,
      stargazers_count: star,
      pushed_at: lastPushedAt,
    } = await this.request(`https://api.github.com/repos/${name}`);
    return { name, url, description, language, star, lastPushedAt, isCn: /[\u4e00-\u9fa5]/.test(description) };
  }

  private async request(url: string, retry = 3) {
    try {
      const { data } = await request({
        url,
        headers: {
          'accept': 'application/vnd.github.v3+json',
          'user-agent': 'octokit-core.js/3.4.0 Node.js/14.15.3 (win32; x64)',
          'authorization': 'token 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',
        },
        timeout: 60000,
        validateStatus: () => true,
      });
      if (data.message) {
        retry = data.message.indexOf('rate') !== -1 ? 3 : 0;
        throw new Error(data.message);
      } else {
        return data;
      }
    } catch (error) {
      if (retry) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.request(url, retry - 1);
      } else {
        throw error;
      }
    }
  }
}

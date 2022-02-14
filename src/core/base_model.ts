import { FilterQuery, Model, QueryOptions } from 'mongoose';

export interface PaginateOptions extends QueryOptions {
  limit?: number;

  page?: number;
}

export interface PaginateResult<T> {
  docs: T[];

  hasNextPage: boolean;

  hasPrevPage: boolean;

  limit: number;

  meta?: unknown;

  nextPage?: number;

  page?: number;

  pagingCounter: number;

  prevPage?: number;

  totalDocs: number;

  totalPages: number;
}

export interface BaseModel<T> extends Model<T> {
  paginate: (query?: FilterQuery<T>, options?: PaginateOptions) => Promise<PaginateResult<T>>;
}

import { FilterQuery, Model, QueryOptions } from 'mongoose';
export interface PaginateOptions extends QueryOptions {
  page?: number | undefined;
  limit?: number | undefined;
}
export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number | undefined;
  totalPages: number;
  nextPage?: number | null | undefined;
  prevPage?: number | null | undefined;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: unknown;
}
export interface BaseModel<T> extends Model<T> {
  paginate: (query?: FilterQuery<T>, options?: PaginateOptions) => Promise<PaginateResult<T>>;
}

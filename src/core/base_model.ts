import { FilterQuery, Model, QueryOptions } from 'mongoose';
export interface PaginateOptions extends QueryOptions {
  limit?: number | undefined;
  page?: number | undefined;
}
export interface PaginateResult<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  meta?: unknown;
  nextPage?: number | null | undefined;
  page?: number | undefined;
  pagingCounter: number;
  prevPage?: number | null | undefined;
  totalDocs: number;
  totalPages: number;
}
export interface BaseModel<T> extends Model<T> {
  paginate: (query?: FilterQuery<T>, options?: PaginateOptions) => Promise<PaginateResult<T>>;
}

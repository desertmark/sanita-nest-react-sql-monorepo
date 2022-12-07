export interface IListDto<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

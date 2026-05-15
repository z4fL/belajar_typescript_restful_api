export type Paging = {
  size: number;
  total_page: number;
  current_page: number;
};

export type Pagable<T> = {
  data: Array<T>;
  paging: Paging;
};

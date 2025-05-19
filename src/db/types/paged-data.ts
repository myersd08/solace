type PagedData<T> = {
  data: T[];
  limit: number;
  offset: number;
};

export default PagedData;

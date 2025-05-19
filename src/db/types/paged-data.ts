type PagedData<T> = {
  data: T[];
  limit: number;
  offset: number;
  additionalRecords: boolean;
};

export default PagedData;

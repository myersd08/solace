import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { advocates } from './schema';
import { ilike, or } from 'drizzle-orm';
import { Advocate } from './schema';
import PagedData from './types/paged-data';

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    return {
      selectAdvocates: () => ({
        from: () => ({ data: [], limit: 0, offset: 0 } as PagedData<Advocate>),
      }),
      queryAdvocates: () =>
        ({ data: [], limit: 0, offset: 0 } as PagedData<Advocate>),
    };
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient);

  const selectAdvocates = () => ({
    from: async (limit = 10, offset = 0): Promise<PagedData<Advocate>> => {
      const data = await db
        .select()
        .from(advocates)
        .limit(limit)
        .offset(offset);
      return {
        data,
        limit,
        offset,
      };
    },
  });

  //todo: include numbers in the search
  const queryAdvocates = async (
    searchTerm: string,
    limit = 10,
    offset = 0
  ): Promise<PagedData<Advocate>> => {
    const searchPattern = `%${searchTerm}%`;
    const data = await db
      .select()
      .from(advocates)
      .where(
        or(
          ilike(advocates.firstName, searchPattern),
          ilike(advocates.lastName, searchPattern),
          ilike(advocates.city, searchPattern),
          ilike(advocates.degree, searchPattern)
        )
      )
      .limit(limit)
      .offset(offset);

    return {
      data,
      limit,
      offset,
    };
  };

  return {
    selectAdvocates,
    queryAdvocates,
  };
};

export default setup();

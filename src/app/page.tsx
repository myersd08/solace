'use client';

import { useEffect, useState } from 'react';
import { Advocate } from '../db/schema';

interface SearchState {
  type: 'list' | 'search';
  term: string;
  page: number;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    type: 'list',
    term: '',
    page: 1,
  });
  const limit = 5;
  const [additionalRecords, setAdditionalRecords] = useState(false);

  const fetchAdvocates = async (page: number) => {
    const response = await fetch(`/api/advocates?limit=${limit}&page=${page}`);
    const data = await response.json();
    setAdvocates(data.data);
    setFilteredAdvocates(data.data);
    setAdditionalRecords(data.data.length === limit);
  };

  const fetchSearchResults = async (searchTerm: string, page: number) => {
    const response = await fetch(
      `/api/advocates/search?searchterm=${encodeURIComponent(
        searchTerm
      )}&limit=${limit + 1}&page=${page}`
    );
    const data = await response.json();
    setFilteredAdvocates(data.data.slice(0, limit));
    setAdditionalRecords(data.data.length > limit);
  };

  useEffect(() => {
    if (searchState.type === 'list') {
      console.log('fetching advocates...');
      fetchAdvocates(searchState.page);
    } else {
      console.log('searching advocates...');
      fetchSearchResults(searchState.term, searchState.page);
    }
  }, [searchState]);

  const onSearchTermChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //todo: debounce this
    const newSearchTerm = e.target.value;

    if (!newSearchTerm) {
      //setFilteredAdvocates(advocates);
      setSearchState({ type: 'list', term: '', page: 1 });
      return;
    }

    setSearchState({ type: 'search', term: newSearchTerm, page: 1 });
    await fetchSearchResults(newSearchTerm, 1);
  };

  const onSearchReset = () => {
    setSearchState({ type: 'list', term: '', page: 1 });
  };

  const onNextPage = () => {
    setSearchState((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const onPreviousPage = () => {
    setSearchState((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  return (
    <main style={{ margin: '24px' }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for:
          <input type='text' id='search-term' />
        </p>
        <input
          style={{ border: '1px solid black' }}
          onChange={onSearchTermChange}
        />
        <button onClick={onSearchReset} disabled={searchState.term === ''}>
          Reset Search
        </button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {(advocate.specialties as string[]).map(
                    (s: string, idx: number) => (
                      <div key={`${s}-${idx}`}>{s}</div>
                    )
                  )}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={onPreviousPage} disabled={searchState.page === 1}>
          Previous
        </button>
        <button onClick={onNextPage} disabled={!additionalRecords}>
          Next
        </button>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Advocate } from '../db/schema';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

interface SearchState {
  type: 'list' | 'search';
  term: string;
  page: number;
}

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    type: 'list',
    term: '',
    page: 1,
  });
  const limit = 5;
  const [additionalRecords, setAdditionalRecords] = useState(false);

  //todo: this should go into a UI utilities folder
  const formatPhoneNumber = (
    phoneNumber: number | null | undefined
  ): string => {
    const phoneString = String(phoneNumber);
    if (!phoneString || phoneString === 'undefined' || phoneString === 'null')
      return '';

    const cleaned = phoneString.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneString;
  };

  const fetchAdvocates = async (page: number) => {
    const response = await fetch(`/api/advocates?limit=${limit}&page=${page}`);
    const data = await response.json();
    setFilteredAdvocates(data.data);
    setAdditionalRecords(data.additionalRecords);
  };

  const fetchSearchAdvocates = async (searchTerm: string, page: number) => {
    const response = await fetch(
      `/api/advocates/search?searchterm=${encodeURIComponent(
        searchTerm
      )}&limit=${limit}&page=${page}`
    );
    const data = await response.json();
    setFilteredAdvocates(data.data);
    setAdditionalRecords(data.additionalRecords);
  };

  useEffect(() => {
    if (searchState.type === 'list') {
      console.log('fetching advocates...');
      fetchAdvocates(searchState.page);
    } else {
      console.log('searching advocates...');
      fetchSearchAdvocates(searchState.term, searchState.page);
    }
  }, [searchState]);

  const onSearchTermChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //todo: debounce this
    const newSearchTerm = e.target.value;

    if (!newSearchTerm) {
      setSearchState({ type: 'list', term: '', page: 1 });
      return;
    }

    setSearchState({ type: 'search', term: newSearchTerm, page: 1 });
    await fetchSearchAdvocates(newSearchTerm, 1);
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
      <h1 className='text-2xl font-bold text-center w-full'>
        Solace Advocates
      </h1>
      <br />
      <br />
      <div className='w-full mb-4'>
        Search for:
        <InputText
          id='search-term'
          value={searchState.term}
          onChange={onSearchTermChange}
          className='ml-2 border border-gray-300 rounded'
        />
        <Button
          label='Reset Search'
          onClick={onSearchReset}
          severity='secondary'
          className='ml-2'
        />
      </div>
      <DataTable value={filteredAdvocates} className='p-datatable-sm'>
        <Column
          field='firstName'
          header='First Name'
          bodyClassName='align-top'
        />
        <Column field='lastName' header='Last Name' bodyClassName='align-top' />
        <Column field='city' header='City' bodyClassName='align-top' />
        <Column field='degree' header='Degree' bodyClassName='align-top' />
        <Column
          field='specialties'
          header='Specialties'
          bodyClassName='align-top'
          body={(rowData) => (
            <div>
              {(rowData.specialties as string[]).map(
                (s: string, idx: number) => (
                  <div key={`${s}-${idx}`}>{s}</div>
                )
              )}
            </div>
          )}
        />
        <Column
          field='yearsOfExperience'
          header='Years of Experience'
          bodyClassName='align-top'
        />
        <Column
          field='phoneNumber'
          header='Phone Number'
          bodyClassName='align-top'
          body={(rowData) => formatPhoneNumber(rowData.phoneNumber)}
        />
      </DataTable>
      <div>
        <Button
          label='Previous'
          onClick={onPreviousPage}
          disabled={searchState.page === 1}
          severity='secondary'
          className='mr-2'
        />
        <Button
          label='Next'
          onClick={onNextPage}
          disabled={!additionalRecords}
          severity='secondary'
        />
      </div>
    </main>
  );
}

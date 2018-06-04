import * as qs from 'query-string';

import { Collection, SearchOpts } from './model';

export function getCollectionsList() {
  return new Promise<Collection[]>((resolve) => {
    const colls = [{ name: 'foo' }, { name: 'bar' }, { name: 'qux' }, { name: 'logs' }];
    setTimeout(() => resolve(colls), 1200);
  });
}

export function getCollection(name: string, opts: SearchOpts) {
  return new Promise<object[]>((resolve) => {
    const data = [
      {
        _id: '12345',
        employeeName: 'Joe Smith',
        dateHired: '2018-01-01',
        color: 'blue'
      },
      {
        _id: '99999',
        employeeName: 'Barbara Walters',
        dateHired: '2015-06-01',
        magicNumber: 58
      }
    ];

    setTimeout(() => resolve(data), 1200);
  });
}

export function parseCollectionQueryParams(queryParams: any): SearchOpts | undefined {
  if (!queryParams) {
    return undefined;
  }

  try {
    return {
      start: Number(queryParams.start) || 0,
      limit: Number(queryParams.limit) || 20,
      query: queryParams.query ? (JSON.parse(queryParams.query) as object) : undefined,
      projection: queryParams.projection
        ? (JSON.parse(queryParams.projection) as object)
        : undefined,
      sort: queryParams.sort ? (JSON.parse(queryParams.sort) as SearchOpts['sort']) : undefined
    };
  } catch (err) {
    console.warn('Error parsing query string', err);
    return undefined;
  }
}

export function getDefaultSearchOpts(): SearchOpts {
  return {
    start: 0,
    limit: 20
  };
}

export function getDefaultCollectionSearchString() {
  return '?' + qs.stringify(getDefaultSearchOpts());
}

import * as qs from 'query-string';

import { Collection, SearchOpts } from './model';

import { collections } from './testData';

console.log('Collections: ', collections);

export function getCollectionsList() {
  return new Promise<Collection[]>((resolve) => {
    const colls = collections.map((c) => ({ name: c.name }));
    setTimeout(() => resolve(colls), 1200);
  });
}

export function getCollection(name: string, opts: SearchOpts) {
  return new Promise<object[]>((resolve) => {
    const coll = collections.find((c) => c.name === name)!;
    setTimeout(() => resolve(coll.records), 1200);
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

import * as qs from 'query-string';

import { Collection, SearchOpts } from './model';

import { collectionNames, search } from './testData';

export function getCollectionsList() {
  return new Promise<Collection[]>((resolve) => {
    setTimeout(() => resolve(collectionNames()), 600);
  });
}

export function getCollection(name: string, opts: SearchOpts) {
  return new Promise<object[]>((resolve) => {
    setTimeout(() => resolve(search(name, opts)), 600);
  });
}

export function parseCollectionQueryParams(queryParams: any): SearchOpts | undefined {
  if (!queryParams || Object.keys(queryParams).length === 0) {
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
    /*query: {
      ad: 'cupidatat'
    }*/
  };
}

export function getDefaultCollectionSearchString() {
  return '?' + qs.stringify(getDefaultSearchOpts());
}

import { Collection, CollectionSearchResults, SearchOpts } from './model';

import { collectionNames, search } from './testData';

export function getCollectionsList() {
  return new Promise<Collection[]>((resolve) => {
    setTimeout(() => resolve(collectionNames()), 600);
  });
}

export function getCollection(name: string, opts: SearchOpts): Promise<CollectionSearchResults> {
  return new Promise<CollectionSearchResults>((resolve) => {
    setTimeout(() => resolve(search(name, opts)), 600);
  });
}

export function parseCollectionQueryParams(queryParams: any): SearchOpts | undefined {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return undefined;
  }

  try {
    return {
      page: Number(queryParams.page) || 0,
      pageSize: Number(queryParams.pageSize) || 20,
      query: queryParams.query ? (JSON.parse(queryParams.query) as object) : undefined,
      projection: queryParams.projection
        ? (JSON.parse(queryParams.projection) as object)
        : undefined,
      sortCol: queryParams.sortCol || undefined,
      sortOrder: queryParams.sortOrder || undefined
    };
  } catch (err) {
    console.warn('Error parsing query string', err);
    return undefined;
  }
}

export function getDefaultSearchOpts(): SearchOpts {
  return {
    page: 0,
    pageSize: 20
  };
}

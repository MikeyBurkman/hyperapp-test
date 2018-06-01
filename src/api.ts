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

export function parseCollectionSearchQuery(
  queryString: string
): { parsed: SearchOpts; str: string } | undefined {
  if (!queryString) {
    return undefined;
  }

  try {
    const opts = qs.parse(queryString);
    const parsed = {
      start: Number(opts.start) || 0,
      limit: Number(opts.limit) || 20,
      query: opts.query ? (JSON.parse(opts.query) as object) : undefined,
      projection: opts.projection ? (JSON.parse(opts.projection) as object) : undefined,
      sort: opts.sort ? (JSON.parse(opts.sort) as SearchOpts['sort']) : undefined
    };
    return {
      parsed: parsed,
      str: '?' + qs.stringify(parsed)
    };
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log('Error parsing query string', err);
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

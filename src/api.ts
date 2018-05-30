export interface Collection {
  name: string;
}

export function getCollectionsList() {
  return new Promise<Collection[]>((resolve) => {
    const colls = [{ name: 'foo' }, { name: 'bar' }, { name: 'qux' }, { name: 'logs' }];
    setTimeout(() => resolve(colls), 1200);
  });
}

export interface SearchOpts {
  start: number;
  limit: number;
  query?: object;
  projection?: object;
  sort?: {
    col: string;
    order: 'ASC' | 'DESC';
  };
}

export function getCollection(name: string, opts: SearchOpts) {
  return new Promise<object[]>((resolve) => {
    const data = [
      {
        _id: '12345',
        employeeName: 'Joe Smith',
        dateHired: '2018-01-01'
      },
      {
        _id: '99999',
        employeeName: 'Barbara Walters',
        dateHired: '2015-06-01'
      }
    ];

    setTimeout(() => resolve(data), 1200);
  });
}

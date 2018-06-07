import lorem from 'lorem-ipsum';
import * as seedrandom from 'seedrandom';

import { CollectionSearchResults, SearchOpts } from './model';

const rng = seedrandom('test');

const collections = ['COLLECTION_1', 'COLLECTION_2', 'COLLECTION_3', 'COLLECTION_4'].map((n) => ({
  name: n,
  records: generateRandomRecords()
}));

export function collectionNames() {
  return collections.map((c) => ({ name: c.name }));
}

export function search(name: string, opts: SearchOpts): CollectionSearchResults {
  const coll = collections.find((c) => c.name === name)!;
  const records = coll.records.filter((r) => {
    const q = opts.query;

    if (q) {
      for (const k in q) {
        if (r[k] !== q[k]) {
          return false;
        }
      }
    }

    return true;
  });

  const start = opts.page * opts.pageSize;
  const page = records.slice(start, start + opts.pageSize);
  return {
    results: page,
    total: records.length,
    timestamp: new Date()
  };
}

function generateRandomRecords() {
  const count = genInt(150) + 30;

  const headers: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    headers.push(genString().toLowerCase());
  }

  const records: any[] = [];
  for (let i = 0; i < count; i += 1) {
    const r: any = {
      _id: genObjectID(),
      _index: i + 1
    };
    for (const h of headers) {
      if (genInt(10) > 2) {
        r[h] = genString();
      }
    }
    records.push(r);
  }

  return records;
}

function genInt(max: number): number {
  return Math.ceil(rng() * max);
}

function genString(): string {
  return lorem({
    count: 1,
    units: 'words',
    random: rng
  });
}

function genObjectID(): string {
  const r: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    r.push(genInt(16).toString(16));
  }
  return r.join('');
}

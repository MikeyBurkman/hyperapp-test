import lorem from 'lorem-ipsum';
import * as seedrandom from 'seedrandom';

const rng = seedrandom('test');

export const collections = ['COLLECTION_1', 'COLLECTION_2', 'COLLECTION_3', 'COLLECTION_4'].map(
  (n) => ({
    name: n,
    records: generateRandomRecords()
  })
);

function generateRandomRecords() {
  const count = genInt(30) + 10;

  const headers: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    headers.push(genString());
  }

  const records: object[] = [];
  for (let i = 0; i < count; i += 1) {
    const r: any = {
      _id: genString()
    };
    for (const h of headers) {
      if (genInt(10) > 2) {
        r[h] = genString();
      } else {
        r[h] = undefined;
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

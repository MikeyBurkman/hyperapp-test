import { Component, h } from 'hyperapp';

import { CollectionSearchResults, collectionView, CollectionView } from './model';

interface ViewProps {
  collection: CollectionView;
}

const view: Component<ViewProps> = ({ collection }) => {
  return collectionView.match(collection, {
    unfetched: () => getProgressBar('bg-info'),
    fetching: (name) => getProgressBar('bg-info', name),
    loaded: (name, opts, results) => formatResults(name, results),
    error: () => getProgressBar('bg-danger')
  });
};
export default view;

function getProgressBar(type: string, collName?: string) {
  const c = `progress-bar progress-bar-striped progress-bar-animated ${type}`;
  return (
    <div>
      {formatCollectionName(collName)}
      <div class="progress">
        <div
          class={c}
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

function formatCollectionName(collName?: string) {
  if (collName) {
    return (
      <div>
        <h2>{collName}</h2>
      </div>
    );
  } else {
    return <span />;
  }
}

function formatResults(collName: string, searchResults: CollectionSearchResults) {
  const headers = getHeaders(searchResults.results);
  return (
    <div>
      {formatCollectionName(collName)}
      <table class="table">
        <caption>As of {searchResults.timestamp.toString()}</caption>
        {formatHeaders(headers)}
        <tbody>{searchResults.results.map((row) => formatRow(row, headers))}</tbody>
      </table>
    </div>
  );
}

function getHeaders(rows: object[]): string[] {
  const headers = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => headers.add(key));
  });
  return Array.from(headers).sort();
}

function formatHeaders(headers: string[]) {
  return (
    <thead>
      <tr>{headers.map((key) => <th>{key}</th>)}</tr>
    </thead>
  );
}

function formatRow(row: any, headers: string[]) {
  const vals = headers.map((key) => row[key]);

  return <tr>{vals.map((v) => <td>{v}</td>)}</tr>;
}

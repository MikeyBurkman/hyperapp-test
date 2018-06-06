import { Component, h } from 'hyperapp';

import { CollectionSearchResults, collectionView, CollectionView, SearchOpts } from './model';

import { getDefaultSearchOpts } from './api';

interface ViewProps {
  name: string;
  opts: SearchOpts;
  collection: CollectionView;
  onSearch: (opts: SearchOpts) => any;
}

const view: Component<ViewProps> = ({ name, opts, collection, onSearch }) => {
  const body = collectionView.match(collection, {
    fetching: () => <div>{getProgressBar('bg-info')}</div>,
    loaded: (results) => <div>{formatResults(name, results)}</div>,
    error: () => <div>{getProgressBar('bg-danger')}</div>
  });

  return (
    <div class="container">
      <div class="row">{formatCollectionName(name)}</div>
      <div class="row">{getForm(opts, (newOpts) => onSearch(newOpts))}</div>
      <div class="row">{body}</div>
    </div>
  );
};
export default view;

function getProgressBar(type: string) {
  const c = `progress-bar progress-bar-striped progress-bar-animated ${type}`;
  return (
    <div class="col">
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

function formatCollectionName(collName: string) {
  return (
    <div class="col">
      <h2>{collName}</h2>
    </div>
  );
}

function formatResults(collName: string, searchResults: CollectionSearchResults) {
  const headers = getHeaders(searchResults.results);
  return (
    <div class="col">
      <table class="table">
        <caption>As of {searchResults.timestamp.toString()}</caption>
        {formatHeaders(headers)}
        <tbody>{searchResults.results.map((row) => formatRow(row, headers))}</tbody>
      </table>
    </div>
  );
}

function getHeaders(rows: object[]): string[] {
  let hasId = false;
  const headers = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key === '_id') {
        hasId = true;
      } else {
        headers.add(key);
      }
    });
  });
  const ordered = Array.from(headers).sort();

  // If we had an _id header, then make sure it always comes first
  return hasId ? ['_id'].concat(ordered) : ordered;
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

function getForm(opts: SearchOpts, search: (opts: SearchOpts) => any) {
  const query = opts && opts.query && JSON.stringify(opts.query, null, 2);
  const projection = opts && opts.projection && JSON.stringify(opts.projection, null, 2);
  const pageSize = opts && opts.limit;
  const pageSizeOpt = (size: number) => <option value={size}>{size}</option>;

  const newOpts = Object.assign({}, opts); // Mutable version of opts that will be used when we click search
  const onQueryChange = (text: string) => {
    newOpts.query = text ? JSON.parse(text) : undefined;
  };
  const onProjectionChange = (text: string) => {
    newOpts.projection = text ? JSON.parse(text) : undefined;
  };
  const onPageSizeChange = (value: number) => {
    newOpts.limit = value;
  };
  const onSubmit = () => search(newOpts);

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <label>
            Query
            <textarea
              class="form-control"
              rows="5"
              onchange={(e: any) => onQueryChange(e.target.value)}
            >
              {query}
            </textarea>
          </label>
        </div>
        <div class="col">
          <label>
            Projection
            <textarea
              class="form-control"
              rows="5"
              onchange={(e: any) => onProjectionChange(e.target.value)}
            >
              {projection}
            </textarea>
          </label>
        </div>
        <div class="col-2">
          <label>
            Page Size
            <select
              class="form-control"
              value={pageSize}
              onchange={(e: any) => onPageSizeChange(e.target.value)}
            >
              {pageSizeOpt(10)}
              {pageSizeOpt(20)}
              {pageSizeOpt(50)}
              {pageSizeOpt(100)}
            </select>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button class="btn btn-primary" onclick={onSubmit}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

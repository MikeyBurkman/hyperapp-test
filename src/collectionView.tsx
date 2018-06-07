import { Component, h } from 'hyperapp';

import {
  CollectionSearchResults,
  collectionView,
  CollectionView,
  NewAlert,
  SearchOpts
} from './model';

import { getDefaultSearchOpts } from './api';

interface ViewProps {
  name: string;
  opts: SearchOpts;
  collection: CollectionView;
  onSearch: () => any;
  onAlert: (alert: NewAlert) => any;
  updateOpts: (newOpts: SearchOpts) => any;
}

const view: Component<ViewProps> = ({ name, opts, collection, onSearch, onAlert, updateOpts }) => {
  const body = collectionView.match(collection, {
    fetching: () => <div>{getProgressBar('bg-info')}</div>,
    loaded: (results) => <div>{formatResults(name, results)}</div>,
    error: () => <div>{getProgressBar('bg-danger')}</div>
  });

  return (
    <div class="container">
      <div class="row">
        <div class="col">{formatCollectionName(name)}</div>
      </div>
      <div class="row">
        <div class="col">{getForm(opts, updateOpts, onSearch, onAlert)}</div>
      </div>
      <div class="row">
        <div class="col">{body}</div>
      </div>
    </div>
  );
};
export default view;

function getProgressBar(type: string) {
  const c = `progress-bar progress-bar-striped progress-bar-animated ${type}`;
  return (
    <div class="progress mt-5">
      <div
        class={c}
        role="progressbar"
        aria-valuenow="100"
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ width: '100%' }}
      />
    </div>
  );
}

function formatCollectionName(collName: string) {
  return <h2>{collName}</h2>;
}

function formatResults(collName: string, searchResults: CollectionSearchResults) {
  const headers = getHeaders(searchResults.results);
  return (
    <table class="table my-2">
      <caption>As of {searchResults.timestamp.toString()}</caption>
      {formatHeaders(headers)}
      <tbody>{searchResults.results.map((row) => formatRow(row, headers))}</tbody>
    </table>
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

function getForm(
  opts: SearchOpts,
  onOptsUpdate: (opts: SearchOpts) => any,
  search: () => any,
  alert: (alert: NewAlert) => any
) {
  const query = opts && opts.query && JSON.stringify(opts.query, null, 2);
  const projection = opts && opts.projection && JSON.stringify(opts.projection, null, 2);
  const pageSize = opts && opts.limit;
  const pageSizeOpt = (size: number) => <option value={size}>{size}</option>;

  const newOpts = Object.assign({}, opts); // Mutable version of opts that will be used when we click search

  const onQueryChange = (text: string) => {
    try {
      onOptsUpdate(Object.assign({}, opts, { query: text ? JSON.parse(text) : undefined }));
    } catch {
      alert({
        type: 'danger',
        text: 'Error parsing Query'
      });
    }
  };
  const onProjectionChange = (text: string) => {
    try {
      onOptsUpdate(Object.assign({}, opts, { projection: text ? JSON.parse(text) : undefined }));
    } catch {
      alert({
        type: 'danger',
        text: 'Error parsing Projection'
      });
    }
  };
  const onPageSizeChange = (value: number) => {
    onOptsUpdate(Object.assign({}, opts, { limit: value }));
  };

  return (
    <div class="container my-2">
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
        <div class="col-auto">
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
          <button class="btn btn-primary" onclick={search}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

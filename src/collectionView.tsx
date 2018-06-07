import { Component, h } from 'hyperapp';
import * as R from 'ramda';

import {
  CollectionSearchResults,
  collectionView,
  CollectionView,
  NewAlert,
  SearchOpts
} from './model';

interface ViewProps {
  name: string;
  opts: SearchOpts;
  collection: CollectionView;
  onAlert: (alert: NewAlert) => any;
  updateOpts: (newOpts: SearchOpts) => any;
}

const view: Component<ViewProps> = ({ name, opts, collection, onAlert, updateOpts }) => {
  const body = collectionView.match(collection, {
    fetching: () => <div>{getProgressBar('bg-info')}</div>,
    loaded: (results) => <div>{formatResults(name, results, opts, updateOpts)}</div>,
    error: () => <div>{getProgressBar('bg-danger')}</div>
  });

  return (
    <div class="container">
      <div class="row">
        <div class="col">{formatCollectionName(name)}</div>
      </div>
      <div class="row">
        <div class="col">{getForm(opts, updateOpts, onAlert)}</div>
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

function formatResults(
  collName: string,
  searchResults: CollectionSearchResults,
  opts: SearchOpts,
  onOptsUpdate: (opts: SearchOpts) => any
) {
  const onPageChange = (n: number) =>
    onOptsUpdate(
      Object.assign({}, opts, {
        page: n
      })
    );
  const headers = getHeaders(searchResults.results);
  const start = opts.page * opts.pageSize;
  const end = Math.min(start + opts.pageSize, searchResults.total);
  const caption = `Showing ${start} - ${end} of ${
    searchResults.total
  } records, as of ${searchResults.timestamp.toString()}`;
  return (
    <div>
      {getPagination(opts, searchResults, onPageChange)}
      <table class="table my-2">
        <caption>{caption}</caption>
        {formatHeaders(headers)}
        <tbody>{searchResults.results.map((row) => formatRow(row, headers))}</tbody>
      </table>
      {getPagination(opts, searchResults, onPageChange)}
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

function getForm(
  opts: SearchOpts,
  onOptsUpdate: (opts: SearchOpts) => any,
  alert: (alert: NewAlert) => any
) {
  const query = opts && opts.query && JSON.stringify(opts.query, null, 2);
  const projection = opts && opts.projection && JSON.stringify(opts.projection, null, 2);
  const pageSize = opts && opts.pageSize;
  const pageSizeOpt = (size: number) => <option value={size}>{size}</option>;

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
    onOptsUpdate(
      Object.assign({}, opts, {
        page: 0,
        pageSize: value
      })
    );
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
    </div>
  );
}

function getPagination(
  opts: SearchOpts,
  results: CollectionSearchResults,
  onPageSelect: (page: number) => any
) {
  const numPages = Math.ceil(results.total / opts.pageSize);
  const maxPages = 8; // Maximum to display at one time

  const pageEle = (idx: number, active: boolean, disabled: boolean, label?: string) => {
    const cls = `page-item ${active && 'active'} ${disabled && 'disabled'}`;
    const onClick = () => onPageSelect(idx);
    return (
      <li class={cls}>
        <a class="page-link" onclick={onClick}>
          {label || idx + 1}
        </a>
      </li>
    );
  };

  const [startPage, endPage] = (() => {
    if (opts.page < maxPages / 2) {
      return [0, Math.min(maxPages, numPages)];
    } else if (opts.page > numPages - maxPages / 2) {
      return [numPages - maxPages, numPages];
    } else {
      return [opts.page - maxPages / 2, opts.page + maxPages / 2];
    }
  })();

  const pages = R.range(startPage, endPage).map((idx) => pageEle(idx, idx === opts.page, false));

  // Add the first/last page buttons
  if (startPage === 1) {
    // Logic is slightly funky on these, because we only want to show the `...` if we're skipping pages
    pages.unshift(pageEle(0, false, false));
  } else if (startPage > 1) {
    pages.unshift(pageEle(0, false, false, '1...'));
  }

  if (endPage === numPages - 1) {
    // Logic is slightly funky on these, because we only want to show the `...` if we're skipping pages
    pages.push(pageEle(numPages - 1, false, false));
  } else if (endPage < numPages - 1) {
    pages.push(pageEle(numPages - 1, false, false, `...${numPages}`));
  }

  const prev = pageEle(opts.page - 1, false, opts.page === 0, 'Previous');
  const next = pageEle(opts.page + 1, false, opts.page === numPages - 1, 'Next');

  return (
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        {prev}
        {pages}
        {next}
      </ul>
    </nav>
  );
}

import { Link } from '@hyperapp/router';
import { ActionResult, ActionsType, ActionType, Component, h } from 'hyperapp';

import { isEqual } from 'lodash';
import { t, Union } from 'ts-union';

import { getCollection, SearchOpts } from '../../api';

interface SearchResults {
  results: object[];
  timestamp: Date;
}

const collData = Union({
  fetching: t(),
  loaded: t<SearchResults>(),
  error: t()
});

type CollData = typeof collData.T;

export interface State {
  firstLoad: boolean;
  name: string | null;
  searchOpts: SearchOpts | null;
  data: CollData;
}

export const initialState: State = {
  firstLoad: true,
  name: null,
  searchOpts: null,
  data: collData.fetching()
};

// Update
export interface Actions {
  updateData(state: Partial<State>): State;
  search(params: { name: string; opts: SearchOpts }): State;
}

export const actions: ActionsType<State, Actions> = {
  updateData: (state: Partial<State>) => ({ ...state }),
  search: ({ name, opts }: { name: string; opts: SearchOpts }) => ($state: State, a: Actions) => {
    if (name === $state.name && isEqual(opts, $state.searchOpts)) {
      // Already searching
      return;
    }
    const timestamp = new Date();
    getCollection(name, opts).then((results) => {
      a.updateData({
        name: name,
        searchOpts: opts,
        data: collData.loaded({
          results: results,
          timestamp: timestamp
        })
      });
    });
    return {
      name: name,
      searchOpts: opts,
      data: collData.fetching()
    };
  }
};

// View
export interface ViewProps {
  state: State;
}

export const view: Component<ViewProps, State, Actions> = ({ state }) => {
  const body = collData.match(state.data, {
    fetching: () => getProgressBar('bg-info'),
    error: () => getProgressBar('bg-danger'),
    loaded: (searchResults) => formatResults(searchResults)
  });

  return (
    <div>
      <h2>{state.name}</h2>
      {body}
    </div>
  );
};

function getProgressBar(type: string) {
  const c = `progress-bar progress-bar-striped progress-bar-animated ${type}`;
  return (
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
  );
}

function formatResults(searchResults: SearchResults) {
  const headers = getHeaders(searchResults.results);
  return (
    <div>
      <table class="table">
        {formatHeaders(headers)}
        <tbody>{searchResults.results.map((row) => formatRow(row, headers))}</tbody>
      </table>
      <h5>As of {searchResults.timestamp.toString()}</h5>
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

import { Link } from '@hyperapp/router';
import { ActionResult, ActionsType, ActionType, Component, h } from 'hyperapp';

import { t, Union } from 'ts-union';

import { getCollection, SearchOpts } from '../../api';

interface LastSearch {
  results: object[];
  searchOpts: SearchOpts;
}

const collData = Union({
  fetching: t(),
  loaded: t<LastSearch>(),
  error: t()
});

type CollData = typeof collData.T;

export interface State {
  firstLoad: boolean;
  name: string | null;
  data: CollData;
}

export const initialState: State = {
  firstLoad: true,
  name: null,
  data: collData.fetching()
};

// Update
export interface Actions {
  init(params: { name: string; opts: SearchOpts }): State;
  updateData(state: Partial<State>): State;
  search(params: { name: string; opts: SearchOpts }): State;
}

export const actions: ActionsType<State, Actions> = {
  init: ({ name, opts }: { name: string; opts: SearchOpts }) => ($state, $actions) => {
    if (name !== $state.name) {
      return $actions.search({
        name: name,
        opts: opts
      });
    }
  },
  updateData: (state: Partial<State>) => ({ ...state }),
  search: ({ name, opts }: { name: string; opts: SearchOpts }) => ($state: State, a: Actions) => {
    getCollection(name, opts).then((results) => {
      a.updateData({
        name: name,
        data: collData.loaded({
          results,
          searchOpts: opts
        })
      });
    });
    return {
      name: name,
      data: collData.fetching(),
      firstLoad: false
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
    loaded: (lastSearch) => formatResults(lastSearch)
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

function formatResults(lastSearch: LastSearch) {
  const headers = getHeaders(lastSearch.results);
  return (
    <table class="table">
      {formatHeaders(headers)}
      <tbody>{lastSearch.results.map((row) => formatRow(row, headers))}</tbody>
    </table>
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

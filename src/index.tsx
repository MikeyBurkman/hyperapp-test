import { ActionsType, app, h, View } from 'hyperapp';

import * as status from './components/status';

// State
export interface State {
  status: status.State;
}

export const state: State = {
  status: status.initialState
};

// Update
export interface Actions {
  status: status.Actions;
}

export const actions: ActionsType<State, Actions> = {
  status: status.actions
};

// View
const view: View<State, Actions> = (rootState, rootActions) => (
  <main>
    <status.view state={rootState.status} change={rootActions.status.change} />
  </main>
);

app(state, actions, view, document.getElementById('app'));

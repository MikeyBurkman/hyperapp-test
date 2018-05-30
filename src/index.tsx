import {
  Link,
  location,
  LocationActions,
  LocationState,
  Redirect,
  RenderProps,
  Route,
  Switch
} from '@hyperapp/router';
import { ActionsType, app, h, View } from 'hyperapp';

import * as alerts from './components/alerts';
import * as collectionsList from './components/collectionList';

// State
export interface State {
  location: LocationState;
  alerts: alerts.State;
  collectionsList: collectionsList.State;
}

export const state: State = {
  location: location.state,
  alerts: alerts.initialState,
  collectionsList: collectionsList.initialState
};

// Update
export interface Actions {
  location: LocationActions;
  alerts: alerts.Actions;
  collectionsList: collectionsList.Actions;
}

export const actions: ActionsType<State, Actions> = {
  location: location.actions,
  alerts: alerts.actions,
  collectionsList: collectionsList.actions
};

// View
const Foo = ({ match }: RenderProps<{ name: string }>) => {
  return (
    <div>
      <h3>Name: {match.params.name}</h3>
    </div>
  );
};
const view: View<State, Actions> = (rootState, rootActions) => (
  <main>
    <alerts.view state={rootState.alerts} viewActions={rootActions.alerts} />

    <Switch>
      <Route path="/collections/:name" render={Foo} />
      <Route
        path="/"
        parent
        render={({ match }) =>
          match.isExact ? (
            <collectionsList.view state={rootState.collectionsList} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    </Switch>
  </main>
);

const main = app(state, actions, view, document.getElementById('app'));
main.collectionsList.fetchCollections();

location.subscribe(main.location);

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

import { getDefaultCollectionSearchString, parseCollectionSearchQuery } from './api';
import * as alerts from './components/alerts';
import * as collectionsList from './components/collectionList';
import * as collectionView from './components/collectionView';

// State
export interface State {
  location: LocationState;
  alerts: alerts.State;
  collectionsList: collectionsList.State;
  collectionView: collectionView.State;
}

export const state: State = {
  location: location.state,
  alerts: alerts.initialState,
  collectionsList: collectionsList.initialState,
  collectionView: collectionView.initialState
};

// Update
export interface Actions {
  location: LocationActions;
  alerts: alerts.Actions;
  collectionsList: collectionsList.Actions;
  collectionView: collectionView.Actions;
}

export const actions: ActionsType<State, Actions> = {
  location: location.actions,
  alerts: alerts.actions,
  collectionsList: collectionsList.actions,
  collectionView: collectionView.actions
};

// View
const view: View<State, Actions> = (rootState, rootActions) => (
  <main>
    <alerts.view state={rootState.alerts} viewActions={rootActions.alerts} />

    <Switch>
      <Route
        path="/collections/:name"
        render={({ match }: RenderProps<{ name: string }>) => {
          const qs = parseCollectionSearchQuery(window.location.search);
          if (!qs) {
            return <Redirect to={match.url + getDefaultCollectionSearchString()} />;
          }

          if (qs.str !== window.location.search) {
            // To make sure that the search string matches exactly what we're searching
            return <Redirect to={match.url + qs.str} />;
          }

          rootActions.collectionView.init({
            name: match.params.name,
            opts: qs.parsed
          });
          return <collectionView.view state={rootState.collectionView} />;
        }}
      />
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

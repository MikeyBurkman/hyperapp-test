import { withLogger } from '@hyperapp/logger';
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

import { Actions, actions } from './actions';
import { initialState, State } from './model';

import AlertsView from './alerts';
import CollectionsListView from './collectionsList';
import CollectionView from './collectionView';

// View
const view: View<State, Actions> = (rootState, rootActions) => (
  <main>
    <AlertsView alerts={rootState.alerts} removeAlert={rootActions.removeAlert} />

    <Switch>
      <Route
        path="/collections/:name"
        render={({ match }: RenderProps<{ name: string }>) => {
          const qs = parseCollectionSearchQuery(window.location.search);
          if (!qs) {
            console.log('No query string, redirecting');
            return <Redirect to={match.url + getDefaultCollectionSearchString()} />;
          }

          if (qs.str !== window.location.search) {
            console.log('Query string does not match, redirecting');
            // To make sure that the search string matches exactly what we're searching
            return <Redirect to={match.url + qs.str} />;
          }

          rootActions.search({
            name: match.params.name,
            opts: qs.parsed
          });
          return <CollectionView />;
        }}
      />
      <Route
        path="/"
        parent
        render={({ match }) => (match.isExact ? <CollectionsListView /> : <Redirect to="/" />)}
      />
    </Switch>
  </main>
);

const main = withLogger(app)(initialState, actions, view, document.getElementById('app'));
main.fetchCollections();
main.addAlert({ text: 'Test Alert', type: 'primary' });

location.subscribe(main.location);

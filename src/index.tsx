import { withLogger } from '@hyperapp/logger';
import { app, h, View } from 'hyperapp';

import { Actions, actions } from './actions';
import { initialState, page, SearchOpts, State } from './model';

import AlertsView from './alerts';
import BreadCrumbs from './breadcrumbs';
import CollectionsListView from './collectionsList';
import CollectionView from './collectionView';

// View
const view: View<State, Actions> = (rootState, rootActions) => (
  <main>
    <AlertsView alerts={rootState.alerts} removeAlert={rootActions.removeAlert} />
    <BreadCrumbs navigate={rootActions.router.navigate} />

    <App state={rootState} a={rootActions} />
  </main>
);

const main = withLogger(app)(initialState, actions, view, document.getElementById('app'));
main.addAlert({ text: 'Test Alert', type: 'primary' });
main.router.init({
  config: [['collection', '/collections/:name'], ['home', '/']],
  onPageChange: main.onPageChange
});

function App({ state, a }: { state: State; a: any }) {
  return page.match(state.page, {
    unknown: () => <h1>Unknown Page!</h1>,
    collectionsList: (list) => (
      <CollectionsListView
        collectionList={list}
        navToCollection={(name: string) => main.router.navigate(`/collections/${name}`)}
      />
    ),
    collectionView: (name, opts, coll) => (
      <CollectionView
        name={name}
        opts={opts}
        collection={coll}
        onSearch={(newOpts: SearchOpts) => main.search({ name, opts: newOpts })}
      />
    )
  });
}

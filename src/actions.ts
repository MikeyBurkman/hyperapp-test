import { ActionsType } from 'hyperapp';

import { Actions as RouterActions, router } from './router';

import {
  Alert,
  Collection,
  CollectionsList,
  collectionsList,
  CollectionView,
  collectionView,
  page,
  Page,
  SearchOpts,
  State
} from './model';

import { getCollection, getCollectionsList, getDefaultSearchOpts } from './api';

export interface Actions {
  // Location
  router: RouterActions;
  updatePage: (p: Page) => State;
  onPageChange: () => any;

  // Alerts
  addAlert(alert: Pick<Alert, 'text' | 'type'>): State;
  removeAlert(alertID: number): State;

  // Collections List
  updateCollections(list: CollectionsList): State;
  fetchCollections(): Promise<Collection[]>;

  // Collections View
  search(params: { name: string; opts: SearchOpts }): State;
  updateCollectionsView(collectionsView: CollectionView): State;
}

export const actions: ActionsType<State, Actions> = {
  // Location
  router: router.actions,
  updatePage: (p: Page) => ({ page: p }),
  onPageChange: () => ($state, $actions) => {
    const currPage = $state.router.currentPage;
    if (!currPage) {
      return $actions.updatePage(page.unknown());
    }

    if (currPage.name === 'home') {
      $actions.fetchCollections();
      setTimeout(() => $actions.updatePage(page.collectionsList(collectionsList.unfetched())), 0);
    } else if (currPage.name === 'collection') {
      const name = currPage.pathParams.name;
      const opts = getDefaultSearchOpts(); // TODO use query params
      $actions.search({
        name: name,
        opts: opts
      });
      setTimeout(
        () => $actions.updatePage(page.collectionView(collectionView.fetching(name, opts))),
        0
      );
    }
  },

  // Alerts
  addAlert: (alert) => ($state, a) => {
    const newAlert: Alert = { ...alert, id: $state.alertLatestID };
    return {
      alerts: $state.alerts.concat(newAlert),
      alertLatestID: ($state.alertLatestID += 1)
    };
  },
  removeAlert: (alertID) => ($state) => ({
    alerts: $state.alerts.filter((a) => a.id !== alertID)
  }),

  // Collections List
  updateCollections: (list: CollectionsList) => ({
    page: page.collectionsList(list)
  }),
  fetchCollections: () => ($state, a) => {
    return getCollectionsList()
      .then((cols) => {
        console.log('Fetched columns: ', cols);
        a.updateCollections(collectionsList.fetched(cols));
      })
      .catch((err) => a.updateCollections(collectionsList.error(err.message || err.toString())));
  },

  // Collections View
  updateCollectionsView: (results: CollectionView) => ({
    page: page.collectionView(results)
  }),
  search: ({ name, opts }: { name: string; opts: SearchOpts }) => ($state: State, a: Actions) => {
    const timestamp = new Date();
    getCollection(name, opts).then((results) => {
      a.updateCollectionsView(collectionView.loaded(name, opts, { results, timestamp }));
    });
    return {
      searchResults: collectionView.fetching(name, opts)
    };
  }
};

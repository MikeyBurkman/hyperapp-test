import { ActionsType } from 'hyperapp';

import { Actions as RouterActions, router } from './router';

import * as qs from 'query-string';

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

import {
  getCollection,
  getCollectionsList,
  getDefaultSearchOpts,
  parseCollectionQueryParams
} from './api';

export interface Actions {
  // Location
  router: RouterActions;
  onPageChange(): any;
  updatePage(p: Page): State;

  // Alerts
  addAlert(alert: Pick<Alert, 'text' | 'type'>): State;
  removeAlert(alertID: number): State;

  // Collections List
  updateCollections(list: CollectionsList): State;
  fetchCollections(): Promise<Collection[]>;

  // Collections View
  search(params: { name: string; opts: SearchOpts }): State;
}

export const actions: ActionsType<State, Actions> = {
  // Location
  router: router.actions,
  onPageChange: () => ($state, $actions) => {
    const currPage = $state.router.currentPage;
    if (!currPage) {
      return {
        page: page.unknown()
      };
    }

    if (currPage.name === 'home') {
      $actions.fetchCollections();
      return {
        page: page.collectionsList(collectionsList.unfetched())
      };
    } else if (currPage.name === 'collection') {
      const name = currPage.pathParams.name;
      const opts = parseCollectionQueryParams(currPage.queryParams) || getDefaultSearchOpts();
      const timestamp = new Date();
      getCollection(name, opts).then((results) => {
        $actions.updatePage(
          page.collectionView(name, opts, collectionView.loaded({ results, timestamp }))
        );
      });
      $actions.updatePage(page.collectionView(name, opts, collectionView.fetching()));
    }
  },
  updatePage: (p: Page) => ({ page: p }),

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
      .then((cols) => a.updateCollections(collectionsList.fetched(cols)))
      .catch((err) => a.updateCollections(collectionsList.error(err.message || err.toString())));
  },

  // Collections View
  search: ({ name, opts }: { name: string; opts: SearchOpts }) => ($state: State, a: Actions) => {
    const formatted = {
      start: opts.start,
      limit: opts.limit,
      query: opts.query && JSON.stringify(opts.query),
      projection: opts.projection && JSON.stringify(opts.projection)
    };
    a.router.navigate(`/collections/${name}?${qs.stringify(formatted)}`);
  }
};

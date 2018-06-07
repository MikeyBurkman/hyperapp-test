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
  NewAlert,
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
  addAlert(alert: NewAlert): State;
  removeAlert(alertID: number): State;

  // Collections List
  updateCollections(list: CollectionsList): State;
  fetchCollections(): Promise<Collection[]>;

  // Collections View
  search(params: { name: string; opts: SearchOpts }): State;
  updateSearchOpts(opts: SearchOpts): State;
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
      getCollection(name, opts).then((results) => {
        $actions.updatePage(
          page.collectionView({
            name,
            opts: opts,
            collectionView: collectionView.loaded(results)
          })
        );
      });
      $actions.updatePage(
        page.collectionView({
          name: name,
          opts: opts,
          collectionView: collectionView.fetching()
        })
      );
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
  search: () => ($state: State, a: Actions) => {
    const opts = page.match($state.page, {
      collectionView: (params) => params,
      default: () => null
    });
    if (!opts) {
      console.warn('Trying to run search when not on the collection page. Probably a bug');
      return undefined;
    }

    const searchOpts = opts.opts;
    const formatted = {
      page: searchOpts.page,
      pageSize: searchOpts.pageSize,
      query: searchOpts.query && JSON.stringify(searchOpts.query),
      projection: searchOpts.projection && JSON.stringify(searchOpts.projection)
    };
    a.router.navigate(`/collections/${opts.name}?${qs.stringify(formatted)}`);
  },
  updateSearchOpts: (opts: SearchOpts) => ($state: State, $actions: Actions) => {
    const p = page.match($state.page, {
      collectionView: (params) =>
        page.collectionView({
          ...params,
          opts: opts
        }),
      default: () => {
        console.warn(
          'Trying to update search opts when not on the collection page. Probably a bug'
        );
        return $state.page;
      }
    });
    return $actions.updatePage(p);
  }
};

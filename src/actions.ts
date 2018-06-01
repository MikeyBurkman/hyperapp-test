import { location, LocationActions } from '@hyperapp/router';
import { ActionsType } from 'hyperapp';
import { isEqual } from 'lodash';

import {
  Alert,
  Collection,
  CollectionsList,
  collectionsList,
  CollectionView,
  collectionView,
  SearchOpts,
  State
} from './model';

import { getCollection, getCollectionsList } from './api';

export interface Actions {
  // Location
  location: LocationActions;

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
  location: location.actions,

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
    collectionList: list
  }),
  fetchCollections: () => ($state, a) => {
    a.updateCollections(collectionsList.unfetched());
    return getCollectionsList()
      .then((cols) => a.updateCollections(collectionsList.fetched(cols)))
      .catch((err) => a.updateCollections(collectionsList.error(err.message || err.toString())));
  },

  // Collections View
  updateCollectionsView: (results: CollectionView) => ({ searchResults: results }),
  search: ({ name, opts }: { name: string; opts: SearchOpts }) => ($state: State, a: Actions) => {
    if (
      collectionView.match($state.searchResults, {
        // We have to do this because the router doesn't work on the model directly...
        // No way to really do a proper init, so we might call search repeatedly a lot...
        // https://github.com/hyperapp/router/issues/53
        fetching: (prevName, prevOpts) => name === prevName && isEqual(opts, prevOpts),
        loaded: (prevName, prevOpts) => name === prevName && isEqual(opts, prevOpts),
        default: () => false
      })
    ) {
      // Already searching with these params
      return;
    }

    const timestamp = new Date();
    getCollection(name, opts).then((results) => {
      a.updateCollectionsView(collectionView.loaded(name, opts, { results, timestamp }));
    });
    return {
      searchResults: collectionView.fetching(name, opts)
    };
  }
};

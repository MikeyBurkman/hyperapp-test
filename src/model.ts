import { t, Union } from 'ts-union';

import { location, LocationState } from '@hyperapp/router';

// Alerts
export interface Alert {
  id: number;
  text: string;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

// Collections List

export interface Collection {
  name: string;
}

export const collectionsList = Union({
  unfetched: t(),
  fetched: t<Collection[]>(),
  error: t<string>()
});

export type CollectionsList = typeof collectionsList.T;

// Collections View

export interface CollectionSearchResults {
  results: object[];
  timestamp: Date;
}

export interface SearchOpts {
  start: number;
  limit: number;
  query?: object;
  projection?: object;
  sort?: {
    col: string;
    order: 'ASC' | 'DESC';
  };
}

export const collectionView = Union({
  unfetched: t(),
  fetching: t<string, SearchOpts>(),
  loaded: t<string, SearchOpts, CollectionSearchResults>(),
  error: t()
});

export type CollectionView = typeof collectionView.T;

// All together now

export interface State {
  location: LocationState;
  alertLatestID: number;
  alerts: Alert[];
  collectionList: CollectionsList;
  searchResults: CollectionView;
}

export const initialState: State = {
  location: location.state,
  alertLatestID: 0,
  alerts: [],
  collectionList: collectionsList.unfetched(),
  searchResults: collectionView.unfetched()
};

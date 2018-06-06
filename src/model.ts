import { t, Union } from 'ts-union';

import { router, State as RouterState } from './router';

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
  query?: any;
  projection?: any;
  sort?: {
    col: string;
    order: 'ASC' | 'DESC';
  };
}

export const collectionView = Union({
  fetching: t(),
  loaded: t<CollectionSearchResults>(),
  error: t()
});

export type CollectionView = typeof collectionView.T;

export const page = Union({
  unknown: t(),
  collectionsList: t<CollectionsList>(),
  collectionView: t<string, SearchOpts, CollectionView>()
});
export type Page = typeof page.T;

// All together now

export interface State {
  router: RouterState;
  alertLatestID: number;
  alerts: Alert[];
  page: Page;
}

export const initialState: State = {
  router: router.state,
  alertLatestID: 0,
  alerts: [],
  page: page.collectionsList(collectionsList.unfetched())
};

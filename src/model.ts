import { t, Union } from 'ts-union';

import { router, State as RouterState } from './router';

// Alerts
export interface Alert {
  id: number;
  text: string;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}
export type NewAlert = Pick<Alert, 'text' | 'type'>;

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
  results: object[]; // Length is at most `limit`
  total: number; // Total number of records, ignoring `limit`
  timestamp: Date;
}

export interface SearchOpts {
  page: number;
  pageSize: number;
  query?: any;
  projection?: any;
  sortCol?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const collectionView = Union({
  fetching: t(),
  loaded: t<CollectionSearchResults>(),
  error: t()
});

export type CollectionView = typeof collectionView.T;

export interface CollectionViewData {
  name: string;
  opts: SearchOpts;
  collectionView: CollectionView;
}

export const page = Union({
  unknown: t(),
  collectionsList: t<CollectionsList>(),
  collectionView: t<CollectionViewData>()
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

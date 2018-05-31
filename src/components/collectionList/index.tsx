import { Link } from '@hyperapp/router';
import { ActionResult, ActionsType, ActionType, Component, h } from 'hyperapp';

import { t, Union } from 'ts-union';

import { Collection, getCollectionsList } from '../../api';

const collectionsList = Union({
  unfetched: t(),
  fetched: t<Collection[]>(),
  error: t<string>()
});

type CollectionsList = typeof collectionsList.T;

export interface State {
  collections: CollectionsList;
}

export const initialState: State = {
  collections: collectionsList.unfetched()
};

// Update
export interface Actions {
  updateCollections(list: CollectionsList): State;
  fetchCollections(): Promise<Collection[]>;
}

export const actions: ActionsType<State, Actions> = {
  updateCollections: (list: CollectionsList) => ({ collections: list }),
  fetchCollections: () => ($state, a) => {
    a.updateCollections(collectionsList.unfetched());
    return getCollectionsList()
      .then((cols) => a.updateCollections(collectionsList.fetched(cols)))
      .catch((err) => a.updateCollections(collectionsList.error(err.message || err.toString())));
  }
};

// View
export interface ViewProps {
  state: State;
}

export const view: Component<ViewProps, State, Actions> = ({ state }) => {
  const val = collectionsList.match(state.collections, {
    error: (str) => <span class="alert alert-danger">Error fetching collections: {str}</span>,
    unfetched: () => (
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated bg-info"
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: '100%' }}
        />
      </div>
    ),
    fetched: (collections) => (
      <table class="table">
        <tbody>{collections.map(formatCollection)}</tbody>
      </table>
    )
  });

  return (
    <div>
      <h2>Collections</h2>
      {val}
    </div>
  );
};

function formatCollection(col: Collection) {
  return (
    <tr>
      <td>{col.name}</td>
      <td>
        <Link to={`/collections/${col.name}`}>View</Link>
      </td>
      <td>
        <button>
          <div style={{ color: '#dc3545' }}>
            <i class="fas fa-trash-alt" />
          </div>
        </button>
      </td>
    </tr>
  );
}

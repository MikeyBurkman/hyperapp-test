import { Link } from '@hyperapp/router';
import { Component, h } from 'hyperapp';

import { Collection, collectionsList, CollectionsList } from './model';

interface ViewProps {
  collectionList: CollectionsList;
}

const view: Component<ViewProps> = ({ collectionList }) => {
  const val = collectionsList.match(collectionList, {
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
export default view;

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

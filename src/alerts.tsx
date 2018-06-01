import { Component, h } from 'hyperapp';

import { Actions } from './actions';
import { Alert, State } from './model';

const view: Component<{}, State, Actions> = () => (state, actions) => {
  const AlertEle = (alert: Alert) => (
    <div class={`alert alert-${alert.type}`}>
      {alert.text}
      <button
        type="button"
        class="close"
        aria-label="Close"
        onclick={() => actions.removeAlert(alert.id)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );

  return <div>{state.alerts.map(AlertEle)}</div>;
};
export default view;

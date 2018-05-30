import { ActionResult, ActionsType, ActionType, Component, h } from 'hyperapp';
import { t, Union } from 'ts-union';

// State
interface Alert {
  id: number;
  text: string;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

export interface State {
  alerts: Alert[];
  latestID: number;
}

export const initialState: State = {
  alerts: [],
  latestID: 1
};

// Update
export interface Actions {
  addAlert(alert: Pick<Alert, 'text' | 'type'>): State;
  removeAlert(alertID: number): State;
}

export const actions: ActionsType<State, Actions> = {
  addAlert: (alert) => ($state, a) => {
    const newAlert: Alert = { ...alert, id: $state.latestID };
    return {
      alerts: $state.alerts.concat(newAlert),
      latestID: ($state.latestID += 1)
    };
  },
  removeAlert: (alertID) => ($state) => ({
    alerts: $state.alerts.filter((a) => a.id !== alertID)
  })
};

// View
export interface ViewProps {
  state: State;
  viewActions: Actions;
}

export const view: Component<ViewProps> = ({ state, viewActions }, f) => {
  const AlertEle = (alert: Alert) => (
    <div class={`alert alert-${alert.type}`}>
      {alert.text}
      <button
        type="button"
        class="close"
        aria-label="Close"
        onclick={() => viewActions.removeAlert(alert.id)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );

  return <div>{state.alerts.map(AlertEle)}</div>;
};

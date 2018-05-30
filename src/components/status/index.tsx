import { ActionResult, ActionsType, ActionType, Component, h } from 'hyperapp';
import { t, Union } from 'ts-union';

// State
const status = Union({
  ok: t(),
  fetching: t(),
  serverErrror: t<string>()
});

type Status = typeof status.T;
export interface State {
  curStatus: Status;
}

export const initialState: State = {
  curStatus: status.ok()
};

// Update
export interface Actions {
  change: (newStatus: Status) => State;
}

export const actions: ActionsType<State, Actions> = {
  change: (newStatus) => ($state) => ({ curStatus: newStatus })
};

// View
export interface ViewProps {
  state: State;
  change: (value: Status) => ActionResult<any>;
}

export const view: Component<ViewProps> = ({ state, change }) => {
  const statusText = status.match(state.curStatus, {
    ok: () => 'All ok!',
    fetching: () => 'Fetching data...',
    serverErrror: (err) => `Got server error: ${err}`
  });

  return (
    <div>
      <div class="badge badge-secondary">{statusText}</div>
      <br />
      <ul>
        <li>
          <button onclick={() => change(status.ok())}> Ok</button>
        </li>
        <li>
          <button onclick={() => change(status.fetching())}>Fetching</button>
        </li>
        <li>
          <button onclick={() => change(status.serverErrror('OH NO IT IS RUINED'))}>Error</button>
        </li>
      </ul>
    </div>
  );
};

import { Component, h } from 'hyperapp';

import { Alert } from './model';

interface ViewProps {
  alerts: Alert[];
  removeAlert(id: number): any;
}

const view: Component<ViewProps> = ({ alerts, removeAlert }) => {
  const AlertEle = (alert: Alert) => (
    <div class={`alert alert-${alert.type}`}>
      {alert.text}
      <button type="button" class="close" aria-label="Close" onclick={() => removeAlert(alert.id)}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );

  return <div>{alerts.map(AlertEle)}</div>;
};
export default view;

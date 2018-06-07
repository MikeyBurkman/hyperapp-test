import { Component, h } from 'hyperapp';

import { page, State } from './model';
import { Link } from './router';

interface ViewProps {
  navigate: (path: string) => any;
}

const view: Component<ViewProps, State> = ({ navigate }) => (state) => {
  const places = page.match(state.page, {
    unknown: () => [],
    collectionsList: () => [
      {
        name: 'Home',
        to: '',
        active: true
      }
    ],
    collectionView: ({ name }) => {
      return [
        {
          name: 'Home',
          to: '/',
          active: false
        },
        {
          name: name,
          to: '',
          active: true
        }
      ];
    }
  });

  const crumbs = places.map((p, idx) => {
    const active = idx === places.length - 1 ? 'active' : '';
    const cls = `breadcrumb-item ${active}`;
    const link = active ? p.name : <Link to={p.to}>{p.name}</Link>;
    return (
      <li class={cls} aria-current="page">
        {link}
      </li>
    );
  });

  return (
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">{crumbs}</ol>
    </nav>
  );
};
export default view;

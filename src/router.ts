import { ActionsType, Component, h } from 'hyperapp';
import pathToReg from 'path-to-regexp';
import * as qs from 'query-string';

interface RouteMatch {
  name: string;
  path: string;
  pathParams: {
    [name: string]: string;
  };
  queryParams: object;
}

type RouterConfig = Array<[string, string]>;

interface CompiledMatcher {
  name: string;
  regexp: RegExp;
  path: string;
  keys: string[];
}

export interface State {
  matchers: CompiledMatcher[];
  currentPage: RouteMatch | null;
  onChange: (() => void) | null;
}

interface InitOpts {
  config: RouterConfig;
  onPageChange?: () => any;
}

export interface Actions {
  init: (opts: InitOpts) => State;
  navigate: (path: string) => State;
}

const initialState: State = {
  currentPage: null,
  matchers: [],
  onChange: null
};

const routerActions: ActionsType<State, Actions> = {
  init: (opts: InitOpts) => (state: State, actions: Actions) => {
    const compiledConfig = compileConfig(opts.config);
    const match = parsePath(compiledConfig, window.location.pathname);
    addEventListener('popstate', () => {
      actions.navigate(window.location.pathname);
    });
    if (opts.onPageChange) {
      setTimeout(opts.onPageChange);
    }
    return {
      matchers: compiledConfig,
      currentPage: match,
      onChange: opts.onPageChange
    };
  },
  navigate: (path: string) => (state: State, actions: Actions) => {
    const match = parsePath(state.matchers, path);
    if (!match) {
      console.error('Unmatched path! ', path);
    }
    window.history.pushState(null, '', path);
    if (state.onChange) {
      setTimeout(state.onChange);
    }
    return {
      currentPage: match
    };
  }
};

export type RouterActions = typeof routerActions;

export interface Router {
  state: State;
  actions: RouterActions;
}

export const router: Router = {
  state: initialState,
  actions: routerActions
};

function compileConfig(config: RouterConfig): CompiledMatcher[] {
  return config.map(([name, path]) => {
    const keys: pathToReg.Key[] = [];
    const regexp = pathToReg(path, keys);
    const keyNames = keys.map((k) => k.name as string);
    return {
      name: name,
      keys: keyNames,
      path: path,
      regexp: regexp
    };
  });
}

function parsePath(matchers: CompiledMatcher[], path: string): RouteMatch | null {
  for (const matcher of matchers) {
    const m = matcher.regexp.exec(path);
    if (m) {
      const queryParams = qs.parse(window.location.search);
      const pathKeyMatches = m.slice(1);
      const pathParams: any = {};
      matcher.keys.forEach((key, idx) => {
        pathParams[key] = pathKeyMatches[idx];
      });
      return {
        name: matcher.name,
        path: path,
        pathParams: pathParams,
        queryParams: queryParams
      };
    }
  }

  return null; // No matching route found
}

// TODO: The state passed in is actually the root state, not the router state, hence the any. This is kind of hackish.
export const Link: Component<{ to: string }, State, any> = ({ to }, children) => (
  $state,
  $actions
) => {
  const props = {
    href: to,
    onclick: (e: any) => {
      // TODO type of event
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.altKey ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        // TODO reverse this logic
      } else {
        e.preventDefault();
        $actions.router.navigate(to);
      }
    }
  };

  return h('a', props, children);
};

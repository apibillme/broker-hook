import BrokerClient from 'broker-client';

export const createSourceManager = ({ endpoint, options = {} }) => {
  const state = {
    source: null,
    listenersByName: new Map(),
  };

  return {
    getState() {
      return state;
    },
    addEventListener(name, listener) {
      if (!state.listenersByName.size) {
        state.source = new BrokerClient(endpoint, headers: options.headers);
      }

      const listeners = state.listenersByName.get(name) || new Set();

      listeners.add(listener);

      state.listenersByName.set(name, listeners);

      state.source.addEventListener(name, listener);
    },
    removeEventListener(name, listener) {
      const listeners = state.listenersByName.get(name) || new Set();

      listeners.delete(listener);

      state.source.removeEventListener(name, listener);

      if (!listeners.size) {
        state.listenersByName.delete(name);
      }

      if (!state.listenersByName.size) {
        state.source.close();
        state.source = null;
      }
    },
  };
};

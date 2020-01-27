# Broker Hook

Check out broker - your Real-time Zero-Code API Server - [https://crates.io/crates/broker](https://crates.io/crates/broker)

## API

### `SSEProvider`

The provider manage the subscritpion to the SSE server. You can subscribe multiple times to the same event or on different events. The source is created only once when one of the hook is called inside the tree. The source is destroyed when no more hooks are registered.

#### Options

| Name     | Type     | Required | Default                      | Description                                                                                                             |
| -------- | -------- | -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| endpoint | `string` | `true`   | -                            | The SSE endpoint to target on the server.                                                                               |
| options  | `object` | `false`  | `{ headers: {} }`            | Headers from the broker-client library                                                                                  |

#### Usage

```jsx
import React from 'react';
import { SSEProvider } from 'broker-hook';

const App = () => (
  <SSEProvider
    endpoint="https://sse.example.com"
    options={{
      headers: {
        authorization: 'Bearer 123'
      }
    }}
  >
    {/* ... */}
  </SSEProvider>
);
```

### `useSSE`

The component that uses the hook must be scoped under a `SSEProvider` to have access to the source. Once the hook is created none of the options can be updated (at the moment). You have to unmout / remount the component to update the options.


| Name                 | Type                          | Required | Default                        | Description                                                                     |
| -------------------- | ----------------------------- | -------- | ------------------------------ | ------------------------------------------------------------------------------  |
| eventName            | `string`                      | `true`   | -                              | The name of the event that you want to listen.                                  |
| options              | `object`                      | `false`  | -                              | -                                                                               |
| options.initialState | `T`                           | `false`  | `null`                         | The initial state to use on the first render.                                   |
| options.stateReducer | `(state: T, changes: U) => T` | `false`  | `(state, changes) => changes`  | The state reducer to control how the state should be updated.                   |
| options.parser       | `(input: string) => U`        | `false`  | `(input) => JSON.parse(input)` | The parser to control how the event from the server is provided to the reducer. |

#### Usage

```jsx
import React from 'react';
import { useSSE } from 'react-hooks-sse';

const Comments = () => {
  const state = useSSE('comments', {
    initialState: {
      data: {
        value: null,
      },
    },
    stateReducer(state, changes) {
      // changes.event - event provided by the source
      // changes.data - data provided by the parser

      return changes;
    },
    parser(input) {
      return JSON.parse(input);
    },
  });

  return <p>{state.data.value !== null && <span>{state.data.value}</span>}</p>;
};
```

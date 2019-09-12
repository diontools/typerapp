# Changelog

## v0.1.0

Upgraded to Hyperapp 2.0.1 base.

### Breaking Changes

* Changed Signature of Effect / Subscription.

```tsx
// new: dispatch moved to first argument. And, props default type is undefined.
type Effect<S, P = undefined> = [(dispatch: Dispatch<S>, props: P) => void, P]
type Subscription<S, P = undefined> = [(dispatch: Dispatch<S>, props: P) => () => void, P]

// old
type Effect<S, P = Empty> = [(props: P, dispatch: Dispatch<S>) => void, P]
type Subscription<S, P = Empty> = [(props: P, dispatch: Dispatch<S>) => () => void, P]
```

* Renamed `container` to `node`.

```tsx
// new
app({
    node: document.getElementById('app')
})

// old
app({
    container: document.getElementById('app')
})
```

* Renamed `render` to `view` of `Lazy`.

```tsx
// new
<Lazy view={lazyView} />

// old
<Lazy render={lazyView} />
```

* Use native event type instead of React specific SyntheticEvent on Html.d.ts.

### Obsoleted

* Deleted `ActionParamOf`. Payload Creator instead.
* Deleted `mergedAction`. Payload Creator instead.

### New API

* Payload Creator

```tsx
import { httpText } from 'typerapp/fx'

const Act: Action<State, { value: string }> = (state, payload) => ({ ...state, value: payload.value })

// create payload { value: string } from result by httpText.
httpText([Act, result => ({ value: result.text })], '/')
```

* Allow number of `key`.

```tsx
<div key={1} />
```

* Add `middleware` function.

```tsx
app({
    middleware: dispatch => (action: any, props?: any) => {
        console.log('dispatch', action, props);
        dispatch(action, props);
    }
})
```

## v0.0.1

Initial Release


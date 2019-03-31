# Typerapp

Typerapp is type-safe [Hyperapp V2](https://github.com/jorgebucaran/hyperapp).

Sample: [![Edit typerapp](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/loo59m2nm?fontsize=14&module=%2Fsrc%2Findex.tsx)

## Install

```
npm install typerapp
```

## Modified points from Hyperapp

1. Remove Action `data` argument
2. Add `dispatch` to `view` arguments
3. Pure DOM Events

### Remove Action `data` argument

Typerapp Action is only two arguments.

Hyperapp:

```js
const Act = (state, { value }, data) => ({...})
```

Typerapp:

```typescript
const Act: Action<State, { value: number }> = (state, params) => ({...})
```

### Add `dispatch` to `view` arguments

Hyperapp:

```js
app({
    view: state => ...
})
```

Typerapp:

```tsx
app<State>({
    view: (state, dispatch) => ...
})
```

### Pure DOM Events

Hyperapp:

```tsx
const Input = (state, ev) => ({ ...state, value: ev.currentTarget.value })

app({
    view: state => <div>
        <input
            value={state.value}
            onInput={Input}
        />
    </div>
})
```

Typerapp:

```tsx
const Input: Action<State, string> = (state, value) => ({ ...state, value })

app<State>({
    view: (state, dispatch) => <div>
        <input
            value={state.value}
            onInput={ev => dispatch(Input, ev.currentTarget.value)}
        />
    </div>
})
```

## Types

Type-safe Actions, Effects, Subscriptions, HTML Elements, and more...

### Actions

Type:

```typescript
export type ActionResult<S> = S | [S, ...Effect<any, any>[]]
export type Action<S, P = Empty> = (state: S, params: P) => ActionResult<S>
```

Use:

```typescript
// without parameter
const Increment: Action<State> = state => ({ ...state, value: state.value + 1 })

// with parameter
const Add: Action<State, { amount: number }> = (state, params) => ({
    ...state,
    value: state.value + params.amount
})
```

### Effects

Type:

```typescript
export type Effect<S, P = Empty> = [(props: P, dispatch: Dispatch<S>) => void, P]
```

Define Effect:

```typescript
// Delay Runner Props
export type DelayProps<S, P> = {
    action: EffectAction<S, P>
    duration: number
}

// Delay Effect Runner
const DelayRunner = <S, P>(props: DelayProps<S, P>, dispatch: Dispatch<S>) => {
    setTimeout(() => dispatch(props.action), props.duration)
}

// Delay Effect Constructor
export function delay<S, P>(action: DelayProps<S, P>['action'], props: { duration: number }): Effect<S, DelayProps<S, P>> {
    return [DelayRunner, { action, duration: props.duration }];
}
```

Use:

```typescript
// Increment with Delay
const DelayIncrement: Action<State> = state => [
    state,
    delay(Increment, { duration: 1000 })
]

// Add with Delay
const DelayAdd: Action<State, { amount: number }> = (state, params) => [
    state,
    delay([Add, { amount: params.amount }], { duration: 1000 })
]
```

### Subscriptions

Type:

```typescript
export type Subscription<S, P = Empty> = [(props: P, dispatch: Dispatch<S>) => () => void, P]
```

Define Subscription:

```typescript
// Timer Runner Props
export type TimerProps<S, P> = {
    action: EffectAction<S, P>
    interval: number
}

// Timer Subscription Runner
const timerRunner = <S, P>(props: TimerProps<S, P>, dispatch: Dispatch<S>) => {
    const id = setInterval(() => dispatch(props.action), props.interval)
    return () => clearInterval(id)
}

// Timer Subscription Constructor
export function timer<S, P>(action: TimerProps<S, P>['action'], props: { interval: number }): Subscription<S, TimerProps<S, P>> {
    return [timerRunner, { action, interval: props.interval }]
}
```

Use:

```typescript
app<State>({
    subscriptions: state => [
        timer(Increment, { interval: 1000 })
    ]
})
```

### HTML Elements

Typerapp [Html.d.ts](./types/Html.d.ts) forked from [React of DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react).

## Extras

Typerapp has extra features.

### actionCreator

`actionCreator` is simple modularization function.

```tsx
// part.tsx
import { h, View, actionCreator } from 'typerapp'

type State = {
    foo: string,
    part: {
    	value: number
    }
}

const createAction = actionCreator<State>()('part')

const Add = createAction<{ amount: number }>(state => ({
    ...state,
    value: state.value + params.amount
}))

export const view: View<State> = ({ part: state }, dispatch) => <div>
    {state.value} <button onClick={ev => dispatch(Add, { amount: 10 })}>request</button>
</div>
```

### Helmet

```tsx
import { Helmet } from 'typerapp/helment'

app<State>({
    view: (state, dispatch) => <div>
        <Helmet>
            <title>{state.title}</title>
        </Helmet>
    </div>
})
```

Improve performance by Lazy:

```tsx
const renderHead = (props: { title: string }) => <Helmet>
    <title>{props.title}</title>
</Helmet>

app<State>({
    view: (state, dispatch) => <div>
        <Lazy key="head" render={renderHead} title={state.title} />
    </div>
})
```

### Router

```tsx
import { createRouter, Link, RoutingInfo, Redirect } from 'typerapp/router'

// Update routing
const SetRoute: Action<State, RoutingInfo<State, RouteProps> | undefined> = (state, route) => ({
    ...state,
    routing: route,
})

// Create router
const router = createRouter<State, RouteProps>({
    routes: [{
        title: (state, params) => 'HOME',
        path: '/',
        view: (state, dispatch, params) => <div>home</div>,
    }, {
        title: (state, params) => 'Counter / ' + params.amount,
        path: '/counter/:amount',
        view: (state, dispatch, params) => {
            const amount = params.amount ? parseInt(params.amount, 10) : 1
            return <div>
            	<div>{state.value}</div>
                <button onClick={ev => dispatch(Add, { amount })}></button>
        	</div>
        },
    }, {
        title: (state, params) => 'Redirect!',
        path: '/redirect',
        view: (state, dispatch, params) => <Redirect to="/" />,
    }],
    matched: (routing, dispatch) => dispatch(SetRoute, routing),
})

app<State>({
    view: (state, dispatch) => <div>
        <div><Link to="/">Home</Link></div>
        <div><Link to="/Counter/10">Count10</Link></div>
        <div><Link to="/Redirect">Redirect</Link></div>
        {
            state.routing
                ? state.routing.route.view(state, dispatch, state.routing.params)
                : <div>404</div>
        }
    </div>
})
```

### CSS-in-JS

Typerapp style forked from [Picostyle](https://github.com/morishitter/picostyle).

```tsx
import { style } from 'typerapp/style'

// styled div
const Wrapper = style('div')({
    backgroundColor: 'skyblue',
    width: '50px',
})

// styled div with parameter
const StyledText = style<{ color: string }>('div')(props => ({
    color: props.color,
    transition: "transform .2s ease-out",
    ":hover": {
        transform: "scale(1.5)",
    },
    "@media (orientation: landscape)": {
        fontWeight: "bold",
    },
}))

app<State>({
    view: (state, dispatch) => <div>
        <Wrapper>
            <StyledText color="green">text</StyledText>
        </Wrapper>
    </div>
})
```


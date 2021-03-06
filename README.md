[![npm version](https://badge.fury.io/js/typerapp.svg)](https://www.npmjs.com/package/typerapp)

# Typerapp

Typerapp is type-safe [Hyperapp V2](https://github.com/jorgebucaran/hyperapp) + α. It's written in TypeScript.

Sample: [![Edit typerapp-sample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/diontools/typerapp-sample/tree/master/?fontsize=14&module=%2Fsrc%2Findex.tsx)

Minimum sample: [![Edit typerapp-minimum-sample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/diontools/typerapp-minimum-sample/tree/master/?fontsize=14&module=%2Fsrc%2Findex.tsx)

## Install

```
npm install typerapp
```

> Note:
> Typerapp uses TypeScript source file in node module.
> If you use Webpack ts-loader, enable [allowTsInNodeModules](https://github.com/TypeStrong/ts-loader#allowtsinnodemodules-boolean-defaultfalse) option, and include `node_modules/typerapp` of tsconfig.json.
> It is not necessary for Parcel.

## Modified points from Hyperapp

1. Remove `data` argument from Action
2. Add `dispatch` to `view` arguments
3. Pure DOM Events

### Remove `data` argument from Action

Typerapp Action has only two arguments.

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

In Typerapp, specify a function that takes [Event](https://developer.mozilla.org/ja/docs/Web/API/Event) as an argument to VDOM event.

Then, call the Action using the `dispatch`.

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

## Limitations

TypeScript is NO check for exceed property on Action.

```typescript
const Act: Action<State> = state => ({
    ...state,
    typo: 1 // no error!
})
```

Workaround:

```typescript
// type alias for Action/ActionResult
type MyAction<P = Empty> = Action<State, P>
type MyResult = ActionResult<State>

// explicit return type
const Act: MyAction = (state): MyResult => ({
    ...state,
    typo: 1 // error
})
```

For truly solution, please vote [Exact Types](https://github.com/Microsoft/TypeScript/issues/12936).

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

### ActionParamOf

`ActionParamOf` type gets parameter type of Action from Effect/Subscription Constructor.

```typescript
import { ActionParamOf } from 'typerapp'
import { httpJson } from 'typerapp/fx'

// { json: unknown }
type ParamType = ActionParamOf<typeof httpJson>

const JsonReceived: Action<State, ParamType> = (state, params) => ({
    ...state,
    text: JSON.stringify(params.json)
})
```

### Helmet

`Helmet` renders to the head element of DOM.

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

Recommend performance improvement with Lazy:

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

Typerapp Router is url-based routing Subscription. Router syncs URL to the state by [History](https://developer.mozilla.org/ja/docs/Web/API/History) API.

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

Typerapp `style` forked from [Picostyle](https://github.com/morishitter/picostyle).

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

### SVG hyphened attributes alias

TypeScript is no check for hyphened attributes on TSX.

Please import `typerapp/main/svg-alias` for type checkable camel-case attributes.

In the below, `strokeWidth` and `strokeDasharray` is converted to `stroke-width` and `stroke-dasharray`.

```tsx
import "typerapp/main/svg-alias"

<svg x="0px" y="0px" width="200px" height="3" viewBox="0 0 200 1">
    <line
        x1="0"
        y1="0.5"
        x2="200px"
        y2="0.5"
        stroke="skyblue"
        strokeWidth={3}
        strokeDasharray={5}
    />
</svg>
```

### mergeAction

In Typerapp, if your Effect/Subscription returns a value by Action, you must merge a return value into Action parameter, because Typerapp has not `data` of Action.

In that case, you can use `mergeAction` function.

```typescript
import { EffectAction, Dispatch, Effect } from "typerapp"
import { mergeAction } from 'typerapp/fx/utils'

export type RunnerProps<S, P> = {
    action: EffectAction<S, P, { returnValue: number }>
}

const effectRunner = <S, P>(props: RunnerProps<S, P>, dispatch: Dispatch<S>) => {
    dispatch(mergeAction(props.action, { returnValue: 1234 }))
}

export function effect<S, P>(action: RunnerProps<S, P>["action"]): Effect<S, RunnerProps<S, P>> {
  return [effectRunner, { action }]
}
```


import { h, app, Action, Lazy } from 'typerapp'
import { State, initState } from './states'
import { Delay, Tick } from './effects';
import * as part from './part'

const Increment: Action<State> = state => ({
    ...state,
    value: state.value + 1,
})

const Add: Action<State, { amount: number }> = (state, params) => ({
    ...state,
    value: state.value + params.amount,
})



const OnDelayed = Delay.createAction<State, { amount: number }>((state, params) => ({
    ...state,
    value: state.value + params.amount,
    text: params.startTime,
}))

const DelayAdd: Action<State, { interval: number, amount: number }> = (state, params) => [
    state,
    Delay.create([OnDelayed, { amount: params.amount }], { interval: params.interval }),
]


const OnTimer = Tick.createAction<State>((state, params) => ({
    ...state,
    value: state.value + 1,
    count: params.count,
}))

const ToggleTimer: Action<State> = state => ({
    ...state,
    auto: !state.auto,
})


const Input: Action<State, string> = (state, value) => ({ ...state, input: value })

const lazyView = (p: { auto: State['auto'] }) => (
    <div>
        auto update: {new Date().toISOString()}
    </div>
)

app({
    init: () => [initState, Delay.create([OnDelayed, { amount: 10 }], { interval: 1000 })],
    view: (state, dispatch) => (
        <div>
            <button onClick={ev => dispatch(Increment)}>increment</button>
            <button onClick={ev => dispatch(Add, { amount: 10 })}>add10</button>
            <button onClick={ev => dispatch(DelayAdd, { interval: 1000, amount: 10 })}>delayAdd</button>
            <button onClick={ev => dispatch(ToggleTimer)}>auto:{state.auto ? 'true' : 'false'}</button>
            <p>value: {state.value}</p>
            <p>text: {state.text}</p>
            <p>count: {state.count}</p>
            <p>
                input: <input type="text" value={state.input} onInput={ev => dispatch(Input, ev.currentTarget.value)} /> → {state.input}
            </p>
            <p>
                {part.view(state, dispatch)}
            </p>
            <p>
                {Lazy({ key: 'lazy', render: lazyView, auto: state.auto })}
            </p>
        </div>
    ),
    subscriptions: state => state.auto && Tick.create([OnTimer, undefined], { interval: 500 }),
    container: document.body,
})
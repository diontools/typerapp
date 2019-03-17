import { h, app, Action, Lazy } from 'typerapp'
import { Helmet } from 'typerapp/helmet'
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

const renderHead = (props: { title: string, base?: string }) => <Helmet>
    <title>{props.title}</title>
    <meta charSet="UTF-8" />
    <meta httpEquiv="content-language" content="ja" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
    <link href="./abc.css" rel="stylesheet" />
    <style type="text/css">{'.lazy-view { color: gray } .auto { font-weight: bold }'}</style>
    <script src="/script.js"></script>
    {props.base && <base href={props.base} />}
</Helmet>

app({
    init: () => [initState, Delay.create([OnDelayed, { amount: 10 }], { interval: 1000 })],
    view: (state, dispatch) => (
        <div>
            {Lazy({ key: 'head', render: renderHead, title: state.input, base: state.auto ? 'http://' + state.input : undefined })}

            <button onClick={ev => dispatch(Increment)}>increment</button>
            <button onClick={ev => dispatch(Add, { amount: 10 })}>add10</button>
            <button onClick={ev => dispatch(DelayAdd, { interval: 1000, amount: 10 })}>delayAdd</button>
            <button onClick={ev => dispatch(ToggleTimer)} class={{ auto: state.auto }}>auto:{state.auto ? 'true' : 'false'}</button>
            <div style={{ fontSize: '20px' }}>value: {state.value}</div>
            <div>text: {state.text}</div>
            <div>count: {state.count}</div>
            <div>
                <label htmlFor="input">input:</label>
                <input id="input" type="text" value={state.input} onInput={ev => dispatch(Input, ev.currentTarget.value)} /> → {state.input}
            </div>
            <div>
                {part.view(state, dispatch)}
            </div>
            <div class={'lazy-view'}>
                {Lazy({ key: 'lazy', render: lazyView, auto: state.auto })}
            </div>
        </div>
    ),
    subscriptions: state => [state.auto && Tick.create([OnTimer, undefined], { interval: 500 })],
    container: document.body,
})
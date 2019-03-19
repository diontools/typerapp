import { h, app, Action, Lazy } from 'typerapp'
import { Helmet } from 'typerapp/helmet'
import { style } from 'typerapp/style'
import { Delay, Timer, HttpText } from 'typerapp/fx';
import { State, initState } from './states'
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
    Delay.create([OnDelayed, { amount: params.amount }], { duration: params.interval }),
]


const OnTimer = Timer.createAction<State>((state, params) => ({
    ...state,
    value: state.value + 1,
    count: params.count,
}))

const ToggleTimer: Action<State> = state => ({
    ...state,
    auto: !state.auto,
})


const Input: Action<State, string> = (state, value) => ({ ...state, input: value })

const OnTextResponse = HttpText.createAction<State>((state, params) => ({
    ...state,
    text: params.text
}))

const lazyView = (p: { auto: State['auto'] }) => (
    <div>
        auto update: {new Date().toISOString()}
    </div>
)

const renderHead = (props: { title: string, base?: string }) => <Helmet>
    <title>{props.title}</title>
    <meta httpEquiv="content-language" content="ja" />
    <style type="text/css">{'.lazy-view { color: gray } .auto { font-weight: bold }'}</style>
    {props.base && <base href={props.base} />}
</Helmet>

const Wrapper = style('div')({
    backgroundColor: 'skyblue',
    width: '50px',
})

const StyledText = style<{ color: string }>('div')(props => ({
    color: props.color,
    transition: "transform .2s ease-out",
    ":hover": {
        transform: "scale(1.2)",
    },
    "@media (orientation: landscape)": {
        fontWeight: "bold",
    },
}))

app({
    init: () => initState,
    view: (state, dispatch) => (
        <div>
            <Lazy key="head" render={renderHead} title={state.input} base={state.auto ? 'http://' + state.input : undefined} />

            <button onClick={ev => dispatch(Increment)}>increment</button>
            <button onClick={ev => dispatch(Add, { amount: 10 })}>add10</button>
            <button onClick={ev => dispatch(DelayAdd, { interval: 1000, amount: 10 })}>delayAdd</button>
            <button onClick={ev => dispatch(ToggleTimer)} class={{ auto: state.auto }}>auto:{state.auto ? 'true' : 'false'}</button>
            <button onClick={ev => dispatch([state, HttpText.create(OnTextResponse, ['/', { method: 'GET', window }])])}>http requst</button>
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
            <Wrapper>
                <StyledText color='green'>abc</StyledText>
            </Wrapper>
            <div>
                <svg viewBox="0 0 52.916666 52.916666" width={100}>
                    <path d="m 32.827602,32.61351 q -5.138234,-0.28546 -8.349629,-0.28546 -4.852776,0 -9.134637,0.28546 l -2.997303,8.17122 q -1.677062,4.46027 -1.677062,6.74393 0,1.85547 1.284558,2.56912 1.284558,0.67796 4.852776,0.92773 0.642279,0.0714 0.642279,0.92774 0,0.96342 -0.642279,0.96342 -7.9571255,-0.2141 -8.7778156,-0.2141 -3.9607214,0 -7.38621021,0.2141 Q 0,52.91667 0,51.95325 0,51.09688 0.64227919,51.02551 3.5682175,50.63301 4.8170937,49.27709 6.4584737,47.49298 9.1346369,40.49927 L 17.769724,17.627 Q 22.087267,6.06597 23.300461,2.06957 L 27.475275,0 q 0.499551,0 0.64228,0.6066 2.247977,7.52894 5.709148,17.37722 l 8.2069,23.08637 q 2.283659,6.42279 3.568217,8.2069 0.999101,1.46297 5.24528,1.74842 0.82069,0.0714 0.82069,0.92774 0,0.96342 -0.785008,0.96342 -8.171218,-0.2141 -9.52714,-0.2141 -1.177512,0 -9.34873,0.2141 -0.642279,0 -0.642279,-0.96342 0,-0.85637 0.642279,-0.92774 3.78231,-0.28545 4.852775,-1.03478 0.785008,-0.57092 0.785008,-2.03388 0,-1.35593 -1.677062,-6.2087 z m -27.7607331,18.412 z m 3.7109462,0 z M 24.26388,7.8144 q -0.535233,1.6057 -1.748427,4.81709 -1.32024,3.56822 -1.998202,5.42369 l -4.139132,11.63239 q 2.604799,0.14273 8.099854,0.14273 5.031186,0 7.38621,-0.14273 L 27.689368,18.05518 Q 26.083671,13.30945 24.26388,7.8144 Z" />
                </svg>
            </div>
        </div>
    ),
    subscriptions: state => [state.auto && Timer.create(OnTimer, { interval: 500 })],
    container: document.body,
})
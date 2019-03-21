import { h, app, Action, Lazy, Dispatch } from 'typerapp'
import { Helmet } from 'typerapp/helmet'
import { style } from 'typerapp/style'
import { Delay, Timer, HttpText } from 'typerapp/fx';
import { createRouter, Link, Route, RoutingInfo } from 'typerapp/router'
import { State, RouteProps } from './states'
import * as part from './part'

const Add: Action<State, { amount: number }> = (state, params) => ({
    ...state,
    value: state.value + params.amount,
})


const AddWithDelay: Action<State, { duration: number, amount: number }> = (state, params) => [
    state,
    Delay.create([Add, { amount: params.amount }], { duration: params.duration }),
]


const ToggleAuto: Action<State> = state => ({
    ...state,
    auto: !state.auto,
})


const Input: Action<State, string> = (state, value) => ({ ...state, input: value })

const OnTextResponse = HttpText.createAction<State>((state, params) => ({
    ...state,
    text: params.text
}))

const lazyView = (p: { auto: State['auto'] }) => (
    <div class={{ auto: p.auto }}>
        change at: {new Date().toISOString()}
    </div>
)

const renderHead = (props: { title: string }) => <Helmet>
    <title>Typerapp - {props.title}</title>
    <meta httpEquiv="content-language" content="ja" />
    <style>{'.auto,.active{font-weight:bold}'}</style>
</Helmet>

const Wrapper = style('div')({
    backgroundColor: 'skyblue',
    width: '50px',
})

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

const SetRoute: Action<State, RoutingInfo<State, RouteProps> | undefined> = (state, route) => ({
    ...state,
    routing: route,
})

const Counter = (state: State, dispatch: Dispatch<State>, amount: number = 1) => <div>
    <h2>Counter</h2>
    <button onClick={ev => dispatch(Add, { amount: amount })}>add{amount}</button>
    <button onClick={ev => dispatch(AddWithDelay, { duration: 1000, amount: amount })}>delayAdd</button>
    <button onClick={ev => dispatch(ToggleAuto)}>auto:{state.auto ? 'true' : 'false'}</button>
    <div style={{ fontSize: '20px' }}>value: {state.value}</div>
    <div class={'lazy-view'}>
        <Lazy key='lazy' render={lazyView} auto={state.auto} />
    </div>
</div>

const router = createRouter<State, RouteProps>({
    routes: [{
        title: (state, params) => 'HOME',
        path: '/',
        view: (state, dispatch, params) => <div>home</div>,
    }, {
        title: (state, params) => 'Counter!',
        path: '/counter',
        view: (state, dispatch, params) => Counter(state, dispatch),
    }, {
        title: (state, params) => 'Counter / ' + params.amount,
        path: '/counter/:amount',
        view: (state, dispatch, params) => Counter(state, dispatch, parseInt(params.amount, 10) || undefined),
    }, {
        title: (state, params) => 'Fetch!',
        path: '/fetch',
        view: (state, dispatch, params) => <div>
            <h2>Fetch</h2>
            <button onClick={ev => dispatch([state, HttpText.create(OnTextResponse, '/')])}>http requst</button>
            <button onClick={ev => dispatch({ ...state, text: '' })}>clear text</button>
            <div>text: {state.text}</div>
        </div>,
    }, {
        title: (state, params) => 'Input!',
        path: '/input',
        view: (state, dispatch, params) => <div>
            <h2>Input</h2>
            <div>
                <label htmlFor="input">input:</label>
                <input id="input" type="text" value={state.input} onInput={ev => dispatch(Input, ev.currentTarget.value)} /> → {state.input}
            </div>
        </div>,
    }, {
        title: (state, params) => 'Style!',
        path: '/style',
        view: (state, dispatch, params) => <div>
            <h2>Style</h2>
            <Wrapper>
                <StyledText color='green'>abc</StyledText>
            </Wrapper>
            <div>
                <svg viewBox="0 0 52.916666 52.916666" width={50}>
                    <path d="m 32.827602,32.61351 q -5.138234,-0.28546 -8.349629,-0.28546 -4.852776,0 -9.134637,0.28546 l -2.997303,8.17122 q -1.677062,4.46027 -1.677062,6.74393 0,1.85547 1.284558,2.56912 1.284558,0.67796 4.852776,0.92773 0.642279,0.0714 0.642279,0.92774 0,0.96342 -0.642279,0.96342 -7.9571255,-0.2141 -8.7778156,-0.2141 -3.9607214,0 -7.38621021,0.2141 Q 0,52.91667 0,51.95325 0,51.09688 0.64227919,51.02551 3.5682175,50.63301 4.8170937,49.27709 6.4584737,47.49298 9.1346369,40.49927 L 17.769724,17.627 Q 22.087267,6.06597 23.300461,2.06957 L 27.475275,0 q 0.499551,0 0.64228,0.6066 2.247977,7.52894 5.709148,17.37722 l 8.2069,23.08637 q 2.283659,6.42279 3.568217,8.2069 0.999101,1.46297 5.24528,1.74842 0.82069,0.0714 0.82069,0.92774 0,0.96342 -0.785008,0.96342 -8.171218,-0.2141 -9.52714,-0.2141 -1.177512,0 -9.34873,0.2141 -0.642279,0 -0.642279,-0.96342 0,-0.85637 0.642279,-0.92774 3.78231,-0.28545 4.852775,-1.03478 0.785008,-0.57092 0.785008,-2.03388 0,-1.35593 -1.677062,-6.2087 z m -27.7607331,18.412 z m 3.7109462,0 z M 24.26388,7.8144 q -0.535233,1.6057 -1.748427,4.81709 -1.32024,3.56822 -1.998202,5.42369 l -4.139132,11.63239 q 2.604799,0.14273 8.099854,0.14273 5.031186,0 7.38621,-0.14273 L 27.689368,18.05518 Q 26.083671,13.30945 24.26388,7.8144 Z" />
                </svg>
            </div>
        </div>,
    }, {
        title: (state, params) => 'Sub!',
        path: '/sub',
        view: (state, dispatch, params) => part.view(state, dispatch),
    }],
    matched: (routing, dispatch) => dispatch(SetRoute, routing),
})

app<State>({
    init: {
        value: 1,
        text: '',
        auto: false,
        input: '',
        part: {
            p: 0,
        },
        routing: undefined,
    },
    view: (state, dispatch) => (
        <div>
            <Lazy key="head" render={renderHead} title={state.routing ? state.routing.route.title(state, state.routing.params) : '404'} />

            <ul>
                <li><Link to="/">home</Link></li>
                <li><Link to="/counter">Counter</Link></li>
                <li><Link to="/counter/10">Counter/10</Link></li>
                <li><Link to="/counter/test/value">Counter/test/value</Link></li>
                <li><Link to="/fetch">Fetch</Link></li>
                <li><Link to="/input">Input</Link></li>
                <li><Link to="/style">Style</Link></li>
                <li><Link to="/sub">Sub</Link></li>
                <li><Link to="/unknown">unknown</Link></li>
            </ul>
            {state.routing ? state.routing.route.view(state, dispatch, state.routing.params) : <div>404</div>}
        </div>
    ),
    subscriptions: state => [
        router,
        state.auto && Timer.create([Add, { amount: 1 }], { interval: 500 }),
    ],
    container: document.body,
})
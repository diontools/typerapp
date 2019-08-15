import { h, View, Action, actionCreator, ActionParamOf } from 'typerapp'
import { delay, http } from 'typerapp/fx';

type State = {
    value: number,
    text: string,
    part: {
        foo: string,
    },
}


const NormalAction: Action<State> = (state, params) => ({
    ...state
})

const ParamAction: Action<State, { value: number }> = (state, params) => ({
    ...state,
    value: state.value + params.value,
})

const view: View<State> = (state, dispatch) => <div>
    {/* OK */}
    <button onClick={ev => dispatch(NormalAction)}></button>

    {/* NG */}
    <button onClick={ev => dispatch(NormalAction, undefined)}></button>
    <button onClick={ev => dispatch(NormalAction, {})}></button>
    <button onClick={ev => dispatch(NormalAction, { ___dummy: 1 })}></button>
    <button onClick={ev => dispatch(NormalAction, { a: 1 })}></button>
    <button onClick={ev => dispatch([NormalAction])}></button>
    <button onClick={ev => dispatch([NormalAction, undefined])}></button>
    <button onClick={ev => dispatch([NormalAction, {}])}></button>
    <button onClick={ev => dispatch([NormalAction, { a: 1 }])}></button>
    <button onClick={ev => dispatch([NormalAction, p => 1])}></button>
    <button onClick={ev => dispatch([])}></button>
    <button onClick={ev => dispatch([undefined])}></button>
    <button onClick={ev => dispatch([1])}></button>
    <button onClick={ev => dispatch(['a'])}></button>
    <button onClick={ev => dispatch([null])}></button>


    {/* OK */}
    <button onClick={ev => dispatch(ParamAction, { value: 1 })}></button>
    <button onClick={ev => dispatch([ParamAction, { value: 1 }])}></button>

    {/* NG */}
    <button onClick={ev => dispatch(ParamAction)}></button>
    <button onClick={ev => dispatch(ParamAction, undefined)}></button>
    <button onClick={ev => dispatch(ParamAction, {})}></button>
    <button onClick={ev => dispatch(ParamAction, { a: 1 })}></button>
    <button onClick={ev => dispatch([ParamAction])}></button>
    <button onClick={ev => dispatch([ParamAction, undefined])}></button>
    <button onClick={ev => dispatch([ParamAction, {}])}></button>
    <button onClick={ev => dispatch([ParamAction, { a: 1 }])}></button>
    <button onClick={ev => dispatch([ParamAction, p => ({ value: 1 })])}></button>
</div>


const DelayAction: Action<State> = state => ({ ...state })

// OK
delay(DelayAction, { duration: 1000 })

// NG
delay(DelayAction)
delay(DelayAction, undefined)
delay(DelayAction, {})
delay([DelayAction], { duration: 1000 })
delay([DelayAction, undefined], { duration: 1000 })
delay([DelayAction, {}], { duration: 1000 })
delay([DelayAction, { x: 1 }], { duration: 1000 })


const DelayParamedAction: Action<State, { value: number }> = (state, params) => ({
    ...state,
    value: params.value,
})

// OK
delay([DelayParamedAction, { value: 1 }], { duration: 1000 })

// NG
delay([DelayParamedAction, { value: 'a' }], { duration: 1000 })
delay([DelayParamedAction, { a: 1 }], { duration: 1000 })
delay([DelayParamedAction, 1], { duration: 1000 })
delay([DelayParamedAction, undefined], { duration: 1000 })
delay([DelayParamedAction, null], { duration: 1000 })
delay([DelayParamedAction], { duration: 1000 })
delay(DelayParamedAction, { duration: 1000 })


const HttpAction: Action<State> = state => state

// OK
http(HttpAction, '/')

// NG
http([HttpAction, {}], '/')
http(undefined, '/')
http(null, '/')
http({}, '/')
http([HttpAction], '/')
http([HttpAction, undefined], '/')
http([HttpAction, null], '/')
http([HttpAction, {}], '/')
http([HttpAction, 1], '/')
http([HttpAction, { a: 1 }], '/')


const HttpParamedAction: Action<State, { value: number, response: Response }> = (state, params) => ({
    ...state,
    value: params.value + params.response.status,
})

// OK
http([HttpParamedAction, ret => ({ value: 1, response: ret.response })], '/')
http([HttpParamedAction, { value: 1, response: {} as Response }], '/')

// NG
http([HttpParamedAction, ret => ({ a: 1, response: ret.response })], '/')
http([HttpParamedAction, ret => ret], '/')
http([HttpParamedAction, { value: 1 }], '/')
http([HttpParamedAction, { value: 'a' }], '/')
http([HttpParamedAction, { a: 1 }], '/')
http([HttpParamedAction, {}], '/')
http([HttpParamedAction, undefined], '/')
http([HttpParamedAction, null], '/')
http([HttpParamedAction, 1], '/')
http([HttpParamedAction], '/')
http(HttpParamedAction, '/')
http(null, '/')



const partAction = actionCreator<State>()('part')

const NormalPartAction = partAction((state, params) => ({
    ...state,
}))

const ParamsPartAction = partAction<{ value: number }>((state, params) => ({
    ...state,
    foo: state.foo + params.value.toFixed(),
}))
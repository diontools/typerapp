import { h, View, Action, actionCreator } from 'typerapp'
import { Delay, HttpText } from 'typerapp/fx';

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
    <button onClick={ev => dispatch(NormalAction, {})}></button>
    <button onClick={ev => dispatch([NormalAction, {}])}></button>

    {/* NG */}
    <button onClick={ev => dispatch(NormalAction, undefined)}></button>
    <button onClick={ev => dispatch(NormalAction, { a: 1 })}></button>
    <button onClick={ev => dispatch([NormalAction])}></button>
    <button onClick={ev => dispatch([NormalAction, undefined])}></button>
    <button onClick={ev => dispatch([NormalAction, { a: 1 }])}></button>
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
</div>


const DelayAction = Delay.createAction<State>((state, params) => ({
    ...state
}))

// OK
Delay.create(DelayAction, { duration: 1 })
Delay.create([DelayAction, undefined], { duration: 1 })

// NG
Delay.create(DelayAction)
Delay.create(DelayAction, undefined)
Delay.create(DelayAction, {})
Delay.create([DelayAction])
Delay.create([DelayAction, undefined])
Delay.create([DelayAction, undefined], {})


const DelayParamsAction = Delay.createAction<State, { value: number }>((state, params) => ({
    ...state,
    value: state.value + params.value,
}))

// OK
Delay.create([DelayParamsAction, { value: 1 }], { duration: 1 })

// NG
Delay.create(DelayParamsAction)
Delay.create(DelayParamsAction, undefined)
Delay.create(DelayParamsAction, {})
Delay.create(DelayParamsAction, { duration: 1 })
Delay.create([DelayParamsAction])
Delay.create([DelayParamsAction, undefined])
Delay.create([DelayParamsAction, {}])
Delay.create([DelayParamsAction, undefined], { duration: 1 })
Delay.create([DelayParamsAction, {}], { duration: 1 })
Delay.create([DelayParamsAction, { a: 1 }], { duration: 1 })


const HttpAction = HttpText.createAction<State>((state, params) => ({
    ...state,
    text: params.text,
}))

// OK
HttpText.create(HttpAction, '/')
HttpText.create([HttpAction, undefined], '/')

// NG
HttpText.create(HttpAction, undefined)
HttpText.create(HttpAction, {})
HttpText.create(HttpAction, { a: 1 })
HttpText.create([HttpAction], '/')
HttpText.create([HttpAction, 1], '/')
HttpText.create([HttpAction, 'a'], '/')
HttpText.create([HttpAction, {}], '/')
HttpText.create([HttpAction, { a: 1 }], '/')
HttpText.create([HttpAction, { text: 1 }], '/')


const HttpParamsAction = HttpText.createAction<State, { value: number }>((state, params) => ({
    ...state,
    text: params.text + params.value.toFixed(),
}))

// OK
HttpText.create([HttpParamsAction, { value: 1 }], '/')

// NG
HttpText.create(HttpParamsAction, '/')
HttpText.create([HttpParamsAction], '/')
HttpText.create([HttpParamsAction, undefined], '/')
HttpText.create([HttpParamsAction, 1], '/')
HttpText.create([HttpParamsAction, 'a'], '/')
HttpText.create([HttpParamsAction, null], '/')
HttpText.create([HttpParamsAction, {}], '/')
HttpText.create([HttpParamsAction, { a: 1 }], '/')


const partAction = actionCreator<State>()('part')

const NormalPartAction = partAction((state, params) => ({
    ...state,
}))

const ParamsPartAction = partAction<{ value: number }>((state, params) => ({
    ...state,
    foo: state.foo + params.value.toFixed(),
}))
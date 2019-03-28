import { Effect, EffectRunner2, EffectAction2, EffectO, Action, Dispatch } from 'typerapp'

export type DelayProps<S, P> = {
    action: EffectAction2<S, P, { value: number }>
    duration: number
}

const DelayRunner: EffectRunner2<DelayProps<any, any>> = (props, dispatch) => {
    setTimeout(() => dispatch(props.action), props.duration)
}

export function delay<S, P>(action: DelayProps<S, P>['action'], duration: number): EffectO<DelayProps<S, P>> {
    return [
        DelayRunner,
        { action, duration }
    ];
}

type Callback<S> = (dispatch: Dispatch<S>) => void
const ExecuteRunner: EffectRunner2<Callback<any>> = (callback, dispatch) => callback(dispatch)

export function execute<S>(exec: Callback<S>): EffectO<Callback<S>> {
    return [
        ExecuteRunner,
        exec
    ]
}

type State = { value: string }
const Act1: Action<State> = state => ({ ...state, value: state.value + '1' })
const Act2: Action<State> = state => ({ ...state, value: state.value + '2' })
const Act3: Action<State, { newValue: string }> = (state, params) => ({ ...state, value: params.newValue })

execute<State>(dispatch => {
    dispatch(Act1)
    dispatch(Act2)
    dispatch(Act3, { newValue: 'aaa' })
    dispatch([Act3, { newValue: 'aaa' }])
    dispatch({ value: 'abc' })
})

export const Delay = new Effect<{ duration: number }>((props, dispatch) => {
    setTimeout(
        () => dispatch(props.action[0], props.action[1]),
        props.duration
    )
}, (action, props, runner) => [runner, { action, ...props }])
import { EffectAction, Effect, Dispatch } from 'typerapp'

export type DelayProps<S, P> = {
    action: EffectAction<S, P>
    duration: number
}

const DelayRunner = <S, P>(dispatch: Dispatch<S>, props: DelayProps<S, P>) => {
    setTimeout(() => dispatch(props.action), props.duration)
}

export function delay<S, P>(action: DelayProps<S, P>['action'], props: { duration: number }): Effect<S, DelayProps<S, P>> {
    return [
        DelayRunner,
        { action, duration: props.duration }
    ];
}

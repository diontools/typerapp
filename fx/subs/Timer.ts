import { EffectAction, Dispatch, Subscription } from 'typerapp'

export type TimerProps<S, P> = {
    action: EffectAction<S, P>
    interval: number
}

const timerRunner = <S, P>(dispatch: Dispatch<S>, props: TimerProps<S, P>) => {
    const id = setInterval(() => dispatch(props.action), props.interval)
    return () => clearInterval(id)
}

export function timer<S, P>(action: TimerProps<S, P>['action'], props: { interval: number }): Subscription<S, TimerProps<S, P>> {
    return [timerRunner, { action, interval: props.interval }]
}
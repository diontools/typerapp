import { Effect, Subscription } from "typerapp";

export const Delay = new Effect<{ interval: number }, { startTime: string }>((props, dispatch) => {
    const startTime = Date()
    setTimeout(() => dispatch(props.action, { ...props.params, startTime }), props.interval)
}, (props, runner) => ({
    effect: runner,
    ...props,
}))

export const Tick = new Subscription<{ interval: number }, { count: number }>((props, dispatch) => {
    let count = 0;
    const id = setInterval(
        () => dispatch(props.action, { ...props.params, count: ++count, }),
        props.interval
    )
    return () => clearInterval(id)
}, (props, runner) => ({
    effect: runner,
    ...props,
}))

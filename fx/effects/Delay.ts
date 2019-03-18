import { Effect } from 'typerapp'

export const Delay = new Effect<{ interval: number }, { startTime: string }>((props, dispatch) => {
    const startTime = Date()
    setTimeout(() => dispatch(props.action[0], { ...props.action[1], startTime }), props.interval)
}, (action, props, runner) => [
    runner,
    { action, ...props },
])
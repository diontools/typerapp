import { Subscription } from 'typerapp'

export const Tick = new Subscription<{ interval: number }, { count: number }>((props, dispatch) => {
    let count = 0;
    const id = setInterval(
        () => dispatch(props.action[0], { ...props.action[1], count: ++count, }),
        props.interval
    )
    return () => clearInterval(id)
}, (action, props, runner) => [
    runner,
    { action, ...props },
])
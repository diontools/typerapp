import { Subscription } from 'typerapp'

export const Timer = new Subscription<{ interval: number }, {}>((props, dispatch) => {
    const id = setInterval(
        () => dispatch(props.action[0], props.action[1]),
        props.interval
    )
    return () => clearInterval(id)
}, (action, props, runner) => [runner, { action, ...props }])
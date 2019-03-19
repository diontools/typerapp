import { Effect } from 'typerapp'

export const Delay = new Effect<{ duration: number }, {}>((props, dispatch) => {
    setTimeout(
        () => dispatch(props.action[0], props.action[1]),
        props.duration
    )
}, (action, props, runner) => [runner, { action, ...props }])
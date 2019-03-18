import { Effect } from 'typerapp'

export const Delay = new Effect<{ duration: number }, { startTime: string }>((props, dispatch) => {
    const startTime = Date()
    setTimeout(
        () => dispatch(props.action[0], { ...props.action[1], startTime }),
        props.duration
    )
}, (action, props, runner) => [runner, { action, ...props }])
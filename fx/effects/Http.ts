import { Effect } from 'typerapp'

export const Http = new Effect<string | [string, RequestInit], { response: Response }, { req: string | [string, RequestInit] }>(
    (props, dispatch) => {
        (Array.isArray(props.req)
            ? fetch(props.req[0], props.req[1])
            : fetch(props.req)
        )
            .then(response => dispatch(props.action[0], { ...props.action[1], response }))
            .catch(error => { throw error })
    },
    (action, props, runner) => [runner, { action, req: props }]
)

export const HttpText = new Effect<string | [string, RequestInit], { text: string }, { req: string | [string, RequestInit] }>(
    (props, dispatch) => {
        (Array.isArray(props.req)
            ? fetch(props.req[0], props.req[1])
            : fetch(props.req)
        )
            .then(response => {
                if (!response.ok) throw response
                return response.text()
            })
            .then(text => dispatch(props.action[0], { ...props.action[1], text }))
            .catch(error => { throw error })
    },
    (action, props, runner) => [runner, { action, req: props }]
)
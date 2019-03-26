import { Effect } from 'typerapp'

export type HttpProps = string | [string, RequestInit]

export const Http = new Effect<HttpProps, { response: Response }, { req: HttpProps }>(
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

export const HttpText = new Effect<HttpProps, { text: string }, { req: HttpProps }>(
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

export const HttpJson = new Effect<HttpProps, { json: unknown }, { req: HttpProps }>(
    (props, dispatch) => {
        (Array.isArray(props.req)
            ? fetch(props.req[0], props.req[1])
            : fetch(props.req)
        )
            .then(response => {
                if (!response.ok) throw response
                return response.json()
            })
            .then(json => dispatch(props.action[0], { ...props.action[1], json }))
            .catch(error => { throw error })
    },
    (action, props, runner) => [runner, { action, req: props }]
)
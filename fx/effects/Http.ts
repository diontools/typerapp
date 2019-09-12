import { EffectAction, Dispatch, Effect } from 'typerapp'

export type HttpProps = string | [string, RequestInit]

export type HttpRunnerPropsBase<S, P, EP> = {
    action: EffectAction<S, P, EP>
    req: HttpProps
}


const request = (req: HttpProps) => Array.isArray(req) ? fetch(req[0], req[1]) : fetch(req)


export type HttpRunnerProps<S, P> = HttpRunnerPropsBase<S, P, { response: Response }>

const httpRunner = <S, P>(dispatch: Dispatch<S>, props: HttpRunnerProps<S, P>) => {
    request(props.req)
        .then(response => {
            if (!response.ok) throw response
            dispatch(props.action, { response })
        })
        .catch(error => { throw error })
}

export function http<S, P>(action: HttpRunnerProps<S, P>['action'], req: HttpProps): Effect<S, HttpRunnerProps<S, P>> {
    return [httpRunner, { action, req }]
}


export type HttpTextRunnerProps<S, P> = HttpRunnerPropsBase<S, P, { text: string }>

const httpTextRunner = <S, P>(dispatch: Dispatch<S>, props: HttpTextRunnerProps<S, P>) => {
    request(props.req)
        .then(response => {
            if (!response.ok) throw response
            return response.text()
        })
        .then(text => dispatch(props.action, { text }))
        .catch(error => { throw error })
}

export function httpText<S, P>(action: HttpTextRunnerProps<S, P>['action'], req: HttpProps): Effect<S, HttpTextRunnerProps<S, P>> {
    return [httpTextRunner, { action, req }]
}


export type HttpJsonRunnerProps<S, P> = HttpRunnerPropsBase<S, P, { json: unknown }>

const httpJsonRunner = <S, P>(dispatch: Dispatch<S>, props: HttpJsonRunnerProps<S, P>) => {
    request(props.req)
        .then(response => {
            if (!response.ok) throw response
            return response.json()
        })
        .then((json: unknown) => dispatch(props.action, { json }))
        .catch(error => { throw error })
}

export function httpJson<S, P>(action: HttpJsonRunnerProps<S, P>['action'], req: HttpProps): Effect<S, HttpJsonRunnerProps<S, P>> {
    return [httpJsonRunner, { action, req }]
}
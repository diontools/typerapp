import { EffectAction, Dispatch, Effect } from 'typerapp'
import { mergeAction } from '../utils'

export type HttpProps = string | [string, RequestInit]

export type HttpRunnerPropsBase<S, P, R> = {
    action: EffectAction<S, P, R>
    req: HttpProps
}


const request = (req: HttpProps) => Array.isArray(req) ? fetch(req[0], req[1]) : fetch(req)


export type HttpRunnerProps<S, P> = HttpRunnerPropsBase<S, P, { response: Response }>

const httpRunner = <S, P>(props: HttpRunnerProps<S, P>, dispatch: Dispatch<S>) => {
    request(props.req)
        .then(response => {
            if (!response.ok) throw response
            dispatch(mergeAction(props.action, { response }))
        })
        .catch(error => { throw error })
}

export function http<S, P>(action: HttpRunnerProps<S, P>['action'], req: HttpProps): Effect<S, HttpRunnerProps<S, P>> {
    return [httpRunner, { action, req }]
}


export type HttpTextRunnerProps<S, P> = HttpRunnerPropsBase<S, P, { text: string }>

const httpTextRunner = <S, P>(props: HttpTextRunnerProps<S, P>, dispatch: Dispatch<S>) => {
    request(props.req)
        .then(response => {
            if (!response.ok) throw response
            return response.text()
        })
        .then(text => dispatch(mergeAction(props.action, { text })))
        .catch(error => { throw error })
}

export function httpText<S, P>(action: HttpTextRunnerProps<S, P>['action'], req: HttpProps): Effect<S, HttpTextRunnerProps<S, P>> {
    return [httpTextRunner, { action, req }]
}


export type HttpJsonRunnerProps<S, P> = HttpRunnerPropsBase<S, P, { json: unknown }>

const httpJsonRunner = <S, P>(props: HttpJsonRunnerProps<S, P>, dispatch: Dispatch<S>) => {
    request(props.req)
        .then(response => {
            if (!response.ok) throw response
            return response.json()
        })
        .then((json: unknown) => dispatch(mergeAction(props.action, { json })))
        .catch(error => { throw error })
}

export function httpJson<S, P>(action: HttpJsonRunnerProps<S, P>['action'], req: HttpProps): Effect<S, HttpJsonRunnerProps<S, P>> {
    return [httpJsonRunner, { action, req }]
}
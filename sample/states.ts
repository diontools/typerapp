import { Route } from 'typerapp/router'

export type RouteProps = {
    title: string
}

export type State = {
    value: number,
    text: string,
    auto: boolean,
    input: string,
    part: {
        p: number,
    },
    route?: Route<State, RouteProps>,
}
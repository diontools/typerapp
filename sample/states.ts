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

export const initState: State = {
    value: 1,
    text: '',
    auto: false,
    input: '',
    part: {
        p: 0,
    },
    route: undefined,
}
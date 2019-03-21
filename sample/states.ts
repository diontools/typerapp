import { RoutingInfo, RouteParams } from 'typerapp/router'

export type RouteProps = {
    title: (state: State, params: RouteParams) => string
}

export type State = {
    value: number,
    text: string,
    auto: boolean,
    input: string,
    part: {
        p: number,
    },
    routing?: RoutingInfo<State, RouteProps>,
}
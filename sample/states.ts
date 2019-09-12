import { RoutingInfo, RouteParams } from 'typerapp/router'

export type RouteProps = {
    title: (state: State, params: RouteParams) => string
}

export type State = {
    value: number,
    text: string,
    auto: boolean,
    part: {
        value: number,
    },
    input: string,
    list: string[],
    routing?: RoutingInfo<State, RouteProps>,
}
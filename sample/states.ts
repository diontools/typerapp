import { Route } from 'typerapp/router'

export const initState = {
    value: 1,
    text: '',
    auto: false,
    input: '',
    part: {
        p: 0,
    },
    route: undefined as Route<any> | undefined
}

export type State = typeof initState

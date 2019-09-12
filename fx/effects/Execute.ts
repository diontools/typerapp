import { Dispatch, Effect } from "typerapp"

type Callback<S> = (dispatch: Dispatch<S>) => void

const ExecuteRunner = <S>(dispatch: Dispatch<S>, callback: Callback<S>) => callback(dispatch)

export function execute<S>(exec: Callback<S>): Effect<S, Callback<S>> {
    return [ExecuteRunner, exec]
}
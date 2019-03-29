import { EffectAction, Action } from "typerapp"

export function mergeAction<S, P, R>(action: EffectAction<S, P, R>, extraProps: R): [Action<S, P & R>, P & R] {
    return Array.isArray(action) ? [action[0], { ...action[1], ...extraProps }] : [action, extraProps]
}
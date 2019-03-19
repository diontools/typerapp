import { h, Dispatch, VNode, Subscription, Effect, Action } from '..'

export interface RouterProps<S> {
    routes: Route<S>[],
    matched: (route: Route<S> | undefined, dispatch: Dispatch<S>) => void,
}

export interface Route<S> {
    path: string
    view: (state: S) => VNode
}

export function createRouter<S>(props: RouterProps<S>) {
    const subs = new Subscription<RouterProps<S>>(
        (props, dispatch) => {
            console.log('routing')
            function onLocationChanged() {
                console.log(window.location.pathname)
                for (const r of props.routes) {
                    if (r.path === window.location.pathname) {
                        props.matched(r, dispatch as any)
                        return
                    }
                }
                props.matched(undefined, dispatch as any)
            }

            const push = window.history.pushState
            const replace = window.history.replaceState
            window.history.pushState = function (data, title, url) {
                push.call(this, data, title, url)
                onLocationChanged()
            }
            window.history.replaceState = function (data, title, url) {
                replace.call(this, data, title, url)
                onLocationChanged()
            }
            window.addEventListener("popstate", onLocationChanged)

            onLocationChanged()

            return () => {
                console.log('unrouting')
                window.history.pushState = push
                window.history.replaceState = replace
                window.removeEventListener("popstate", onLocationChanged)
            }
        },
        (action, props, runner) => [runner, { action, ...props }]
    )

    return subs.create(undefined as any, props)
}

export const pushHistory = new Effect<{ to: string }>(
    (props, dispatch) => window.history.pushState(null, '', props.to),
    (action, props, runner) => [runner, { action, ...props }]
)

export interface LinkProps<S> {
    to: string
    dispatch: Dispatch<S>
}

export function Link<S>(props: LinkProps<S>, children: any) {
    return h('a', {
        onClick: (ev: Event) => props.dispatch(MoveTo, { to: props.to, ev }),
        href: props.to
    }, children)
}

export const MoveTo: Action<any, { to: string, ev: Event }> = (state, params) => {
    params.ev.preventDefault()
    return [state, pushHistory.create(undefined as any, params)]
}
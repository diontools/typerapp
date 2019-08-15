import { h, Dispatch, VNode, Subscription, Effect, Action } from 'typerapp'

function debug(args: any[]) {
    //console.log(...args)
}

export interface RouterProps<S, P> {
    routes: Route<S, P>[],
    matched: (routing: RoutingInfo<S, P> | undefined, dispatch: Dispatch<S>) => void,
    _init?: boolean,
}

export type PathSeg = string | {
    id: string
}

export type RouteView<S> = (state: S, dispatch: Dispatch<S>, params: RouteParams) => VNode

export type Route<S, P> = {
    path: string
    view: RouteView<S>
    _pathSegs?: PathSeg[]
} & {
        [N in keyof P]: P[N]
    }

export type RouteParams = { [key: string]: string }

export type RoutingInfo<S, P> = {
    route: Route<S, P>
    params: RouteParams
}

const runner = <S, P>(dispatch: Dispatch<S>, props: RouterProps<S, P>) => {
    debug(['routing'])
    function onLocationChanged() {
        const pathname = window.location.pathname
        debug([pathname])
        for (const route of props.routes) {
            route._pathSegs = route._pathSegs || splitPath(route.path)
            const params = matchPath(pathname, route._pathSegs)
            if (params) {
                props.matched({ route, params }, dispatch)
                return
            }
        }
        props.matched(undefined, dispatch)
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

    if (!props._init) {
        props._init = true
        onLocationChanged()
    }

    return () => {
        debug(['unrouting'])
        window.history.pushState = push
        window.history.replaceState = replace
        window.removeEventListener("popstate", onLocationChanged)
    }
}

export function createRouter<S, P>(props: RouterProps<S, P>): Subscription<S, RouterProps<S, P>> {
    return [runner, props]
}

function splitPath(path: string): PathSeg[] {
    return path
        .split('/')
        .filter(s => s != "")
        .map(s => s[0] === ':' ? { id: s.slice(1) } : s)
}

function matchPath(path: string, segs: PathSeg[]): RouteParams | undefined {
    if (segs.length === 0) return path === '/' ? {} : undefined

    let result: RouteParams | undefined = undefined
    let p = 1 // position

    for (let segIndex = 0; segIndex < segs.length; segIndex++) {
        const seg = segs[segIndex]
        if (typeof seg === "string") {
            if (path.length < p + seg.length) return // out of range
            for (let i = 0; i < seg.length; i++) {
                if (path[p + i] !== seg[i]) return
            }
            p += seg.length
            if (p < path.length && path[p++] !== '/') return // not matching string
        } else {
            const start = p
            for (; ; p++) {
                if (p + 1 === path.length || path[p + 1] === '/') {
                    (result = result || {})[seg.id] = path.slice(start, ++p)
                    break
                }
            }
            if (p < path.length) p++ // skip '/'
        }
    }

    return p === path.length ? result || {} : undefined
}

function pushHistory(to: string) {
    window.history.pushState(null, '', to)
}

function replaceHistory(to: string) {
    window.history.replaceState(null, '', to)
}

export function PushHistory<S>(to: string): Effect<S, string> {
    return [<S, P>(dispatch: Dispatch<S>, to: string) => pushHistory(to), to]
}

export function ReplaceHistory<S>(to: string): Effect<S, string> {
    return [<S, P>(dispatch: Dispatch<S>, to: string) => replaceHistory(to), to]
}

export interface LinkProps<S> {
    to: string
    replace?: boolean
    activeClassName?: string
    dispatch?: Dispatch<S>
}

export function Link<S>(props: LinkProps<S>, children: any) {
    return h('a', {
        onClick: (ev: Event) => {
            if (props.dispatch) {
                props.dispatch(MoveTo, { to: props.to, replace: props.replace, ev })
            } else {
                ev.preventDefault()
                props.replace ? replaceHistory(props.to) : pushHistory(props.to)
            }
        },
        href: props.to,
        class: location.pathname === props.to ? props.activeClassName || 'active' : undefined,
    }, children)
}

export interface RedirectProps<S> {
    to: string
    push?: boolean
    dispatch?: Dispatch<S>
}

export function Redirect<S>(props: RedirectProps<S>, children: any): VNode {
    if (props.dispatch) {
        props.dispatch(MoveTo, { to: props.to, replace: props.push })
    } else {
        props.push ? pushHistory(props.to) : replaceHistory(props.to)
    }
    return h('a', null)
}

export const MoveTo: Action<any, { to: string, replace?: boolean, ev?: Event }> = (state, params) => {
    params.ev && params.ev.preventDefault()
    return [state, (params.replace ? ReplaceHistory : PushHistory)(params.to)]
}
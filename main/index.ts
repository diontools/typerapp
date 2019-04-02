// forked from https://github.com/jorgebucaran/hyperapp

/// <reference path="../types/Html.d.ts" />

const aliases: { [name: string]: string } = {
    acceptCharset: 'accept-charset',
    httpEquiv: 'http-equiv',
    htmlFor: 'for',
}

export const svgAliases: { [name: string]: string } = {}

export function convName(name: string, isSvg?: boolean) {
    return isSvg ? svgAliases[name] || name : aliases[name] || name.toLowerCase()
}

var DEFAULT_NODE = 0
var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3
var EMPTY_OBJECT = {}
var EMPTY_ARRAY: any[] = []

var map = EMPTY_ARRAY.map
var isArray = Array.isArray

var defer =
    typeof Promise === "function"
        ? function (cb: any) {
            Promise.resolve().then(cb)
        }
        : setTimeout

var merge = function <T1, T2>(a: T1, b: T2): T1 & T2 {
    var out = <any>{}

    for (let i in a) out[i] = a[i]
    for (let i in b) out[i] = b[i]

    return out
}

var flatten = function (arr: any[]): any[] {
    return arr.reduce(function (out, obj) {
        return out.concat(
            !obj || obj === true
                ? false
                : typeof obj[0] === "function"
                    ? [obj]
                    : flatten(obj)
        )
    }, EMPTY_ARRAY)
}

var isSameAction = function (a: any, b: any) {
    return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function"
}

var shouldRestart = function (a: any, b: any) {
    for (var k in merge(a, b)) {
        if (a[k] === b[k] || isSameAction(a[k], b[k])) b[k] = a[k]
        else return true
    }
}

var patchSub = function (sub: any[], newSub: any[], dispatch: any) {
    for (var i = 0, a, b, out = []; i < sub.length || i < newSub.length; i++) {
        a = sub[i]
        out.push(
            (b = newSub[i])
                ? !a || b[0] !== a[0] || shouldRestart(b[1], a[1])
                    ? [b[0], b[1], b[0](b[1], dispatch), a && a[2]()]
                    : a
                : a && a[2]()
        )
    }
    return out
}

var createClass = function (obj: any): string {
    var out = ""
    var tmp: string = typeof obj

    if (tmp === "string" || tmp === "number") return obj

    if (isArray(obj) && obj.length > 0) {
        for (var i = 0; i < obj.length; i++) {
            if ((tmp = createClass(obj[i])) !== "") out += (out && " ") + tmp
        }
    } else {
        for (let i in obj) {
            if (obj[i]) out += (out && " ") + i
        }
    }

    return out
}

var updateProperty = function (element: Element, name: string, value: any, newValue: any, eventCb: EventCb, isSvg?: boolean) {
    if (name === "key") {
    } else if (name === "style") {
        for (var i in merge(value, newValue)) {
            var style = newValue == null || newValue[i] == null ? "" : newValue[i]
            if (i[0] === "-") {
                element[name].setProperty(i, style)
            } else {
                element[name][i as any] = style
            }
        }
    } else if (name[0] === "o" && name[1] === "n") {
        if (
            !((element.events || (element.events = {}))[
                (name = name.slice(2).toLowerCase())
            ] = newValue)
        ) {
            element.removeEventListener(name, eventCb)
        } else if (!value) {
            element.addEventListener(name, eventCb)
        }
    } else if (name !== "list" && !isSvg && name in element) {
        (element as any)[name] = newValue == null ? "" : newValue
    } else if (
        newValue == null ||
        newValue === false ||
        (name === "class" && !(newValue = createClass(newValue)))
    ) {
        element.removeAttribute(convName(name, isSvg))
    } else {
        element.setAttribute(convName(name, isSvg), newValue)
    }
}

var removeElement = function (parent: Node, node: VNode) {
    parent.removeChild(node.element)
}

var createElement = function (node: VNode, eventCb: EventCb, isSvg?: boolean) {
    var element =
        node.type === TEXT_NODE
            ? document.createTextNode(node.name)
            : (isSvg = isSvg || node.name === "svg")
                ? document.createElementNS("http://www.w3.org/2000/svg", node.name)
                : document.createElement(node.name)
    var props = node.props

    for (var i = 0, len = node.children.length; i < len; i++) {
        element.appendChild(
            createElement(
                (node.children[i] = getNode(node.children[i])),
                eventCb,
                isSvg
            )
        )
    }

    for (var k in props) {
        updateProperty(<Element>element, k, null, props[k], eventCb, isSvg)
    }

    return (node.element = element)
}

var updateElement = function (element: Element, props: VNodeProps, newProps: VNodeProps, eventCb: EventCb, isSvg?: boolean) {
    for (var k in merge(props, newProps)) {
        if (
            (k === "value" || k === "checked" ? (element as any)[k] : props[k]) !== newProps[k]
        ) {
            updateProperty(element, k, props[k], newProps[k], eventCb, isSvg)
        }
    }
}

var getKey = function (node: VNode) {
    return node == null ? null : node.key
}

var patch = function (parent: Node, element: Element | Text, node: VNode | null, newNode: VNode, eventCb: EventCb, isSvg?: boolean) {
    if (newNode === node) {
    } else if (
        node != null &&
        node.type === TEXT_NODE &&
        newNode.type === TEXT_NODE
    ) {
        if (node.name !== newNode.name) element.nodeValue = newNode.name
    } else if (node == null || node.name !== newNode.name) {
        var newElement = parent.insertBefore(
            createElement((newNode = getNode(newNode)), eventCb, isSvg),
            element
        )

        if (node != null) removeElement(parent, node)

        element = newElement
    } else {
        updateElement(
            <Element>element,
            node.props,
            newNode.props,
            eventCb,
            (isSvg = isSvg || newNode.name === "svg")
        )

        var savedNode
        var childNode

        var key
        var children = node.children
        var start = 0
        var end = children.length - 1

        var newKey
        var newChildren = newNode.children
        var newStart = 0
        var newEnd = newChildren.length - 1

        while (newStart <= newEnd && start <= end) {
            key = getKey(children[start])
            newKey = getKey(newChildren[newStart])

            if (key == null || key !== newKey) break

            patch(
                element,
                children[start].element,
                children[start],
                (newChildren[newStart] = getNode(
                    newChildren[newStart],
                    children[start]
                )),
                eventCb,
                isSvg
            )

            start++
            newStart++
        }

        while (newStart <= newEnd && start <= end) {
            key = getKey(children[end])
            newKey = getKey(newChildren[newEnd])

            if (key == null || key !== newKey) break

            patch(
                element,
                children[end].element,
                children[end],
                (newChildren[newEnd] = getNode(newChildren[newEnd], children[end])),
                eventCb,
                isSvg
            )

            end--
            newEnd--
        }

        if (start > end) {
            while (newStart <= newEnd) {
                element.insertBefore(
                    createElement(
                        (newChildren[newStart] = getNode(newChildren[newStart++])),
                        eventCb,
                        isSvg
                    ),
                    (childNode = children[start]) && childNode.element
                )
            }
        } else if (newStart > newEnd) {
            while (start <= end) {
                removeElement(element, children[start++])
            }
        } else {
            for (var i = start, keyed: VNodeWithKey = {}, newKeyed: VNodeWithKey = {}; i <= end; i++) {
                if ((key = children[i].key) != null) {
                    keyed[key] = children[i]
                }
            }

            while (newStart <= newEnd) {
                key = getKey((childNode = children[start]))
                newKey = getKey(
                    (newChildren[newStart] = getNode(newChildren[newStart], childNode))
                )

                if (
                    newKeyed[key!] ||
                    (newKey != null && newKey === getKey(children[start + 1]))
                ) {
                    if (key == null) {
                        removeElement(element, childNode)
                    }
                    start++
                    continue
                }

                if (newKey == null || node.type === RECYCLED_NODE) {
                    if (key == null) {
                        patch(
                            element,
                            childNode && childNode.element,
                            childNode,
                            newChildren[newStart],
                            eventCb,
                            isSvg
                        )
                        newStart++
                    }
                    start++
                } else {
                    if (key === newKey) {
                        patch(
                            element,
                            childNode.element,
                            childNode,
                            newChildren[newStart],
                            eventCb,
                            isSvg
                        )
                        newKeyed[newKey] = true
                        start++
                    } else {
                        if ((savedNode = <VNode>keyed[newKey]) != null) {
                            patch(
                                element,
                                element.insertBefore(
                                    savedNode.element,
                                    childNode && childNode.element
                                ),
                                savedNode,
                                newChildren[newStart],
                                eventCb,
                                isSvg
                            )
                            newKeyed[newKey] = true
                        } else {
                            patch(
                                element,
                                childNode && childNode.element,
                                null,
                                newChildren[newStart],
                                eventCb,
                                isSvg
                            )
                        }
                    }
                    newStart++
                }
            }

            while (start <= end) {
                if (getKey((childNode = children[start++])) == null) {
                    removeElement(element, childNode)
                }
            }

            for (let key in keyed) {
                if (newKeyed[key] == null) {
                    removeElement(element, <VNode>keyed[key])
                }
            }
        }
    }

    return (newNode.element = element)
}

var shouldUpdate = function (a: any, b: any) {
    for (var k in a) if (a[k] !== b[k]) return true
    for (var k in b) if (a[k] !== b[k]) return true
}

var getNode = function (newNode: VNode, node?: VNode) {
    return newNode.type === LAZY_NODE
        ? !node || shouldUpdate(newNode.lazy, node.lazy)
            ? newNode.render!()
            : node
        : newNode
}

var createVNode = function (name: string, props: VNodeProps, children: VNode[], element: Element | undefined, key: string | null, type: number): VNode {
    return {
        name: name,
        props: props,
        children: children,
        element: element!,
        type: type,
        key: key
    }
}

var createTextVNode = function (text: string, element?: Element) {
    return createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE)
}

var recycleChild = function (element: Element): VNode {
    return element.nodeType === TEXT_NODE
        ? createTextVNode(element.nodeValue!, element)
        : recycleElement(element)
}

var recycleElement = function (element: Element) {
    return createVNode(
        element.nodeName.toLowerCase(),
        EMPTY_OBJECT,
        map.call(element.childNodes, recycleChild) as VNode[],
        element,
        null,
        RECYCLED_NODE
    )
}

export var Lazy = function <P extends { key: string, render: (props: P) => VNode }>(props: P): LazyVNode<P> {
    return {
        type: LAZY_NODE,
        key: props.key,
        lazy: props,
        render: function () {
            var node = props.render(props)
            node.lazy = props
            return node
        }
    } as LazyVNode<P>
}

export var h = function (name: string | Function, props: any, _children?: any): VNode {
    for (var node, rest = [], children = [], i = arguments.length; i-- > 2;) {
        rest.push(arguments[i])
    }

    while (rest.length > 0) {
        if (isArray((node = rest.pop()))) {
            for (i = node.length; i-- > 0;) rest.push(node[i])
        } else if (node === false || node === true || node == null) {
        } else {
            children.push(typeof node === "object" ? node : createTextVNode(node))
        }
    }

    props = props || EMPTY_OBJECT

    return typeof name === "function"
        ? name(props, children)
        : createVNode(name, props, children, undefined, props.key, DEFAULT_NODE)
}

export var app = function <S>(props: AppProps<S>) {
    var container = props.container
    var element: Element | Text = container && container.children[0]
    var node = element && recycleElement(element)
    var subs = props.subscriptions
    var view = props.view
    var lock = false
    var state: S = {} as S
    var sub: any[] = []

    var eventCb: EventCb = function (event) {
        (event.currentTarget as any).events[event.type](event)
    }

    var setState = function (newState: S) {
        if (!(state === newState || lock)) {
            lock = true
            defer(render)
        }
        state = newState
    }

    var dispatch: Dispatch<S> = function (obj: any, props?: any) {
        if (typeof obj === "function") {
            dispatch(obj(state, props))
        } else if (isArray(obj)) {
            if (typeof obj[0] === "function") {
                dispatch(obj[0](state, obj[1], props))
            } else {
                flatten(obj.slice(1)).map(function (fx) {
                    fx && fx[0](fx[1], dispatch)
                }, setState(obj[0]))
            }
        } else {
            setState(obj)
        }
    }

    var render = function () {
        lock = false
        if (subs) sub = patchSub(sub, flatten(subs(state)), dispatch)
        if (view) {
            element = patch(container, element, node, (node = view(state, dispatch)), eventCb)
        }
    }

    dispatch(<S>props.init)
}

type EventCb = (ev: Event) => void
type VNodeWithKey = { [key: string]: VNode | boolean }

export type Empty = { ___dummy: never }

export type ActionResult<S> = S | [S, ...Effect<any, any>[]]
export type Action<S, P = Empty> = (state: S, params: P) => ActionResult<S>

export type Effect<S, P = Empty> = [(props: P, dispatch: Dispatch<S>) => void, P]

export type EffectAction<S, P, R = undefined> =
    R extends undefined
    ? Action<S, Empty> | [Action<S, P>, P]
    : Action<S, R> | [Action<S, P & R>, P]

// extract property types
type PropertyOf<T> =
    T extends any[] ? T :
    T extends Function ? T :
    T extends { [P in keyof T]: infer R } ? R :
    T
// extract from union
type Filter<T, U> = T extends U ? T : never
// tuple to union
type ElementOf<T> = T extends (infer E)[] ? E : T

type ActionParamType<T> = T extends Action<any, infer R> ? R : never

/** Extract action parameter type from Effect Constructor */
export type ActionParamOf<T extends (...args: any[]) => any> =
    ActionParamType<
        Filter<
            PropertyOf<
                ElementOf<
                    Parameters<T>
                >
            >,
            Action<any, any>
        >
    >

export type Subscription<S, P = Empty> = [(props: P, dispatch: Dispatch<S>) => () => void, P]

export type Dispatch<S> = {
    (action: Action<S, Empty>): void
    <P>(action: Action<S, P>, params: P): void
    <P>(actionWithParams: [Action<S, P>, P]): void
    (result: ActionResult<S>): void
    <P>(all: Action<S, Empty> | [Action<S, P>, P] | ActionResult<S>): void
}

export type View<S> = (state: S, dispatch: Dispatch<S>) => VNode

export type AppProps<S> = {
    init: Action<S> | ActionResult<S>,
    view?: View<S>,
    subscriptions?: (state: S) => (Subscription<S, any> | boolean)[],
    container: Element
}

export type Children = VNode | string | number | null

export type VNodeProps = { [key: string]: any }

export interface VNode<Props extends VNodeProps = VNodeProps> {
    name: string,
    props: Props,
    children: Array<VNode>
    element: Element | Text,
    key: string | null,
    type: number,
    lazy?: any
    render?: () => VNode
}

export interface LazyVNode<P> extends VNode {
    lazy: P
    render: () => VNode
}

export interface ClassObject {
    [key: string]: boolean | any
}

export interface ClassArray extends Array<Class> { }

export type Class = string | number | ClassObject | ClassArray

export function actionCreator<S>() {
    return <N extends keyof S>(name: N): (<P1 = {}, P2 = {}>(action: Action<S[N], P1 & P2>) => Action<S, P1 & P2>) => {
        return (action) => {
            return (state, params) => {
                const r = action(state[name], params)
                if (Array.isArray(r)) {
                    const a: ActionResult<S> = r[0] === state[name] ? [state] : [{ ...state, [name]: r[0] }]
                    for (let i = 1; i < r.length; i++) a.push(r[i] as Effect<any, any>)
                    return a
                }
                return r === state[name] ? state : { ...state, [name]: r }
            }
        }
    }
}
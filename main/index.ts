// forked from https://github.com/jorgebucaran/hyperapp

/// <reference path="../types/Html.d.ts" />

const aliases: { [name: string]: string } = {
    acceptCharset: 'accept-charset',
    httpEquiv: 'http-equiv',
    htmlFor: 'for',
}

/** For internal */
export const svgAliases: { [name: string]: string } = {}

/** For internal */
export function convName(name: string, isSvg?: boolean) {
    return isSvg ? svgAliases[name] || name : aliases[name] || name.toLowerCase()
}

var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3
var EMPTY_OBJ = {}
var EMPTY_ARR: any[] = []
var map = EMPTY_ARR.map
var isArray = Array.isArray
var defer =
    typeof requestAnimationFrame !== "undefined"
        ? requestAnimationFrame
        : setTimeout

var createClass = function (obj: any): string {
    var out = ""

    if (typeof obj === "string") return obj

    if (isArray(obj) && obj.length > 0) {
        for (var k = 0, tmp; k < obj.length; k++) {
            if ((tmp = createClass(obj[k])) !== "") {
                out += (out && " ") + tmp
            }
        }
    } else {
        for (let k in obj) {
            if (obj[k]) {
                out += (out && " ") + k
            }
        }
    }

    return out
}

var merge = function <T1, T2>(a: T1, b: T2): T1 & T2 {
    var out = {} as any

    for (let k in a) out[k] = a[k]
    for (let k in b) out[k] = b[k]

    return out
}

var batch = function (list: any[]): any[] {
    return list.reduce(function (out, item) {
        return out.concat(
            !item || item === true
                ? 0
                : typeof item[0] === "function"
                    ? [item]
                    : batch(item)
        )
    }, EMPTY_ARR)
}

var isSameAction = function (a: any, b: any) {
    return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function"
}

var shouldRestart = function (a: any, b: any) {
    if (a !== b) {
        for (var k in merge(a, b)) {
            if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true
            b[k] = a[k]
        }
    }
}

var patchSubs = function (oldSubs: any[], newSubs: any[], dispatch: any) {
    for (
        var i = 0, oldSub, newSub, subs = [];
        i < oldSubs.length || i < newSubs.length;
        i++
    ) {
        oldSub = oldSubs[i]
        newSub = newSubs[i]
        subs.push(
            newSub
                ? !oldSub ||
                    newSub[0] !== oldSub[0] ||
                    shouldRestart(newSub[1], oldSub[1])
                    ? [
                        newSub[0],
                        newSub[1],
                        newSub[0](dispatch, newSub[1]),
                        oldSub && oldSub[2]()
                    ]
                    : oldSub
                : oldSub && oldSub[2]()
        )
    }
    return subs
}

var patchProperty = function (node: Element, key: string, oldValue: any, newValue: any, listener: EventListener, isSvg?: boolean) {
    if (key === "key") {
    } else if (key === "style") {
        for (var k in merge(oldValue, newValue)) {
            oldValue = newValue == null || newValue[k] == null ? "" : newValue[k]
            if (k[0] === "-") {
                node[key].setProperty(k, oldValue)
            } else {
                node[key][k as any] = oldValue
            }
        }
    } else if (key[0] === "o" && key[1] === "n") {
        if (
            !((node.actions || (node.actions = {}))[
                (key = key.slice(2).toLowerCase())
            ] = newValue)
        ) {
            node.removeEventListener(key, listener)
        } else if (!oldValue) {
            node.addEventListener(key, listener)
        }
    } else if (!isSvg && key !== "list" && key in node) {
        (node as any)[key] = newValue == null ? "" : newValue
    } else if (
        newValue == null ||
        newValue === false ||
        (key === "class" && !(newValue = createClass(newValue)))
    ) {
        node.removeAttribute(convName(key, isSvg))
    } else {
        node.setAttribute(convName(key, isSvg), newValue)
    }
}

var createNode = function (vdom: VNode, listener: EventListener, isSvg?: boolean) {
    var ns = "http://www.w3.org/2000/svg"
    var props = vdom.props
    var node =
        vdom.type === TEXT_NODE
            ? document.createTextNode(vdom.name)
            : (isSvg = isSvg || vdom.name === "svg")
                ? document.createElementNS(ns, vdom.name, { is: props.is })
                : document.createElement(vdom.name, { is: props.is })

    for (var k in props) {
        patchProperty(node as Element, k, null, props[k], listener, isSvg)
    }

    for (var i = 0, len = vdom.children.length; i < len; i++) {
        node.appendChild(
            createNode(
                (vdom.children[i] = getVNode(vdom.children[i])),
                listener,
                isSvg
            )
        )
    }

    return (vdom.node = node)
}

var getKey = function (vdom: VNode) {
    return vdom == null ? null : vdom.key
}

var patch = function (parent: Node, node: Element | Text, oldVNode: VNode | null, newVNode: VNode, listener: EventListener, isSvg?: boolean) {
    if (oldVNode === newVNode) {
    } else if (
        oldVNode != null &&
        oldVNode.type === TEXT_NODE &&
        newVNode.type === TEXT_NODE
    ) {
        if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name
    } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
        node = parent.insertBefore(
            createNode((newVNode = getVNode(newVNode)), listener, isSvg),
            node
        )
        if (oldVNode != null) {
            parent.removeChild(oldVNode.node)
        }
    } else {
        var tmpVKid
        var oldVKid

        var oldKey
        var newKey

        var oldVProps = oldVNode.props
        var newVProps = newVNode.props

        var oldVKids = oldVNode.children
        var newVKids = newVNode.children

        var oldHead = 0
        var newHead = 0
        var oldTail = oldVKids.length - 1
        var newTail = newVKids.length - 1

        isSvg = isSvg || newVNode.name === "svg"

        for (var i in merge(oldVProps, newVProps)) {
            if (
                (i === "value" || i === "selected" || i === "checked"
                    ? (node as any)[i]
                    : oldVProps[i]) !== newVProps[i]
            ) {
                patchProperty(node as Element, i, oldVProps[i], newVProps[i], listener, isSvg)
            }
        }

        while (newHead <= newTail && oldHead <= oldTail) {
            if (
                (oldKey = getKey(oldVKids[oldHead])) == null ||
                oldKey !== getKey(newVKids[newHead])
            ) {
                break
            }

            patch(
                node,
                oldVKids[oldHead].node,
                oldVKids[oldHead],
                (newVKids[newHead] = getVNode(
                    newVKids[newHead++],
                    oldVKids[oldHead++]
                )),
                listener,
                isSvg
            )
        }

        while (newHead <= newTail && oldHead <= oldTail) {
            if (
                (oldKey = getKey(oldVKids[oldTail])) == null ||
                oldKey !== getKey(newVKids[newTail])
            ) {
                break
            }

            patch(
                node,
                oldVKids[oldTail].node,
                oldVKids[oldTail],
                (newVKids[newTail] = getVNode(
                    newVKids[newTail--],
                    oldVKids[oldTail--]
                )),
                listener,
                isSvg
            )
        }

        if (oldHead > oldTail) {
            while (newHead <= newTail) {
                node.insertBefore(
                    createNode(
                        (newVKids[newHead] = getVNode(newVKids[newHead++])),
                        listener,
                        isSvg
                    ),
                    (oldVKid = oldVKids[oldHead]) && oldVKid.node
                )
            }
        } else if (newHead > newTail) {
            while (oldHead <= oldTail) {
                node.removeChild(oldVKids[oldHead++].node)
            }
        } else {
            var newKeyed: VNodeWithKey = {}, keyed: VNodeWithKey = {}
            for (let i = oldHead; i <= oldTail; i++) {
                if ((oldKey = oldVKids[i].key) != null) {
                    keyed[oldKey] = oldVKids[i]
                }
            }

            while (newHead <= newTail) {
                oldKey = getKey((oldVKid = oldVKids[oldHead]))
                newKey = getKey(
                    (newVKids[newHead] = getVNode(newVKids[newHead], oldVKid))
                )

                if (
                    newKeyed[oldKey!] ||
                    (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
                ) {
                    if (oldKey == null) {
                        node.removeChild(oldVKid.node)
                    }
                    oldHead++
                    continue
                }

                if (newKey == null || oldVNode.type === RECYCLED_NODE) {
                    if (oldKey == null) {
                        patch(
                            node,
                            oldVKid && oldVKid.node,
                            oldVKid,
                            newVKids[newHead],
                            listener,
                            isSvg
                        )
                        newHead++
                    }
                    oldHead++
                } else {
                    if (oldKey === newKey) {
                        patch(
                            node,
                            oldVKid.node,
                            oldVKid,
                            newVKids[newHead],
                            listener,
                            isSvg
                        )
                        newKeyed[newKey] = true
                        oldHead++
                    } else {
                        if ((tmpVKid = keyed[newKey] as VNode) != null) {
                            patch(
                                node,
                                node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                                tmpVKid,
                                newVKids[newHead],
                                listener,
                                isSvg
                            )
                            newKeyed[newKey] = true
                        } else {
                            patch(
                                node,
                                oldVKid && oldVKid.node,
                                null,
                                newVKids[newHead],
                                listener,
                                isSvg
                            )
                        }
                    }
                    newHead++
                }
            }

            while (oldHead <= oldTail) {
                if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
                    node.removeChild(oldVKid.node)
                }
            }

            for (var i in keyed) {
                if (newKeyed[i] == null) {
                    node.removeChild((keyed[i] as VNode).node)
                }
            }
        }
    }

    return (newVNode.node = node)
}

var propsChanged = function (a: any, b: any) {
    for (var k in a) if (a[k] !== b[k]) return true
    for (var k in b) if (a[k] !== b[k]) return true
}

var getVNode = function (newVNode: VNode, oldVNode?: VNode) {
    return newVNode.type === LAZY_NODE
        ? ((!oldVNode || propsChanged(oldVNode.lazy, newVNode.lazy)) &&
            ((oldVNode = newVNode.lazy!.view(newVNode.lazy)).lazy = newVNode.lazy),
            oldVNode!)
        : newVNode
}

var createVNode = function (name: string, props: VNodeProps, children: VNode[], node: Element | undefined, key: string | undefined, type?: number): VNode {
    return {
        name: name,
        props: props,
        children: children,
        node: node!,
        type: type!,
        key: key!
    }
}

var createTextVNode = function (value: string, node?: Element) {
    return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, undefined, TEXT_NODE)
}

var recycleNode = function (node: Element): VNode {
    return node.nodeType === TEXT_NODE
        ? createTextVNode(node.nodeValue!, node)
        : createVNode(
            node.nodeName.toLowerCase(),
            EMPTY_OBJ,
            map.call(node.childNodes, recycleNode) as VNode[],
            node,
            undefined,
            RECYCLED_NODE
        )
}

/** Function to create Lazy VNode */
export var Lazy = function <P>(props: LazyProp<P>): VNode {
    return {
        lazy: props as LazyProp<unknown>,
        type: LAZY_NODE
    } as VNode
}

/** Function to create VNode */
export var h = function (name: string | Function, props?: {} | null, _children?: any) {
    for (var vdom: any, rest = [], children = [], i = arguments.length; i-- > 2;) {
        rest.push(arguments[i])
    }

    while (rest.length > 0) {
        if (isArray((vdom = rest.pop()))) {
            for (let i = vdom.length; i-- > 0;) {
                rest.push(vdom[i])
            }
        } else if (vdom === false || vdom === true || vdom == null) {
        } else {
            children.push(typeof vdom === "object" ? vdom : createTextVNode(vdom))
        }
    }

    props = props || EMPTY_OBJ

    return typeof name === "function"
        ? name(props, children)
        : createVNode(name, props, children, undefined, (props as any).key)
}

/** Function to start typerapp application */
export var app = function <S>(props: AppProps<S>) {
    var state: S = {} as any
    var lock = false
    var view = props.view
    var node: Element | Text = props.node
    var vdom = node && recycleNode(node)
    var subscriptions = props.subscriptions
    var subs: any[] = []

    var listener: EventListener = function (event) {
        (event.currentTarget as Element).actions![event.type](event)
    }

    var setState = function (newState: S) {
        if (state !== newState) {
            state = newState
            if (subscriptions) {
                subs = patchSubs(subs, batch([subscriptions(state)]), dispatch)
            }
            if (view && !lock) defer(render, (lock = true) as any)
        }
        return state
    }

    var dispatch: Dispatch<S> = (props.middleware ||
        function (obj: any) {
            return obj
        })(function (action: any, props?: any) {
            return typeof action === "function"
                ? dispatch(action(state, props))
                : isArray(action)
                    ? typeof action[0] === "function"
                        ? dispatch(
                            action[0],
                            typeof action[1] === "function" ? action[1](props) : action[1]
                        )
                        : (batch(action.slice(1)).map(function (fx) {
                            fx && fx[0](dispatch, fx[1])
                        }, setState(action[0])),
                            state)
                    : setState(action)
        })

    var render = function () {
        lock = false
        node = patch(
            node.parentNode!,
            node,
            vdom,
            (vdom =
                typeof (vdom = view(state, dispatch)) === "string"
                    ? createTextVNode(vdom)
                    : vdom),
            listener
        )
    }

    dispatch(props.init)
}

type EventListener = (ev: Event) => void
type VNodeWithKey = { [key: string]: VNode | boolean }

/** Dummy param type of Action */
export type Empty = { ___dummy: never }

/** Return type of Action */
export type ActionResult<S> = S | [S, ...Effect<any, any>[]]

/** Action type */
export type Action<S, P = Empty> = (state: S, params: P) => ActionResult<S>

/** Action type for Effect */
export type EffectAction<S, P, EP = undefined> =
    EP extends undefined
    ? Action<S, Empty> | [Action<S, P>, P]
    : Action<S, Empty> | [Action<S, P>, P] | [Action<S, P>, (effectPayload: EP) => P]

/** Effect object type */
export type Effect<S, P = Empty> = [(dispatch: Dispatch<S>, props: P) => void, P]

/** Subscription object type */
export type Subscription<S, P = Empty> = [(dispatch: Dispatch<S>, props: P) => () => void, P]

/** Return type of subscriptions function on app */
export type Subscriptions<S> = Subscription<S, any> | boolean | (Subscription<S, any> | boolean)[]

/** dispatch function type */
export type Dispatch<S> = {
    (action: Action<S, Empty>): void
    <P>(action: Action<S, P>, params: P): void
    <P>(actionWithParams: [Action<S, P>, P]): void
    (result: ActionResult<S>): void
    <P, EP>(effectAction: EffectAction<S, P, EP>, effectPayload: EP): void
    <P>(all: Action<S, Empty> | [Action<S, P>, P] | ActionResult<S>): void
}

/** Return type of view function on app */
export type View<S> = (state: S, dispatch: Dispatch<S>) => VNode

/** Argument type of app function */
export type AppProps<S> = {
    /** Initial state, Effect or Action */
    init: Action<S> | ActionResult<S>,

    /** VDOM rendering function */
    view: View<S>,

    /** Create subscription function */
    subscriptions?: (state: S) => Subscriptions<S>,

    /** Element for rendering target */
    node: Element,

    /** Interrupt dispatch function */
    middleware?: (dispatch: Dispatch<S>) => Dispatch<S>,
}

/** VNode props type */
export type VNodeProps = { [key: string]: any }

/** Lazy props type */
export type LazyProp<P> = { key: string, view: (props: P) => VNode } & P

/** Node type of VDOM */
export interface VNode<Props extends VNodeProps = VNodeProps> {
    name: string,
    props: Props,
    children: Array<VNode>
    node: Element | Text,
    key: string | null,
    type: number,
    lazy?: LazyProp<unknown>,
    render?: () => VNode
}

/** Class object type */
export interface ClassObject {
    [key: string]: boolean | any
}

/** Array type of Class object type */
export interface ClassArray extends Array<Class> { }

/** Class type */
export type Class = string | number | ClassObject | ClassArray

/** Modularization function */
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
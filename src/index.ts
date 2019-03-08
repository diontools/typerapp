var DEFAULT_NODE = 0
var RECYCLED_NODE = 1
var LAZY_NODE = 2
var TEXT_NODE = 3

var XLINK_NS = "http://www.w3.org/1999/xlink"
var SVG_NS = "http://www.w3.org/2000/svg"

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
    var target = <any>{}

    for (let i in a) target[i] = a[i]
    for (let i in b) target[i] = b[i]

    return target
}

function createClass(obj: any): string {
    var tmp: string = typeof obj
    var out = ""

    if (tmp === "string" || tmp === "number") return obj || ""

    if (isArray(obj) && obj.length > 0) {
        for (var i = 0, length = obj.length; i < length; i++) {
            if ((tmp = createClass(obj[i])) !== "") out += (out && " ") + tmp
        }
    } else {
        for (let i in obj) {
            if (obj[i]) out += (out && " ") + i
        }
    }

    return out
}

var updateProperty = function (
    element: Element,
    name: string,
    oldValue: any,
    newValue: any,
    eventCb: EventCb,
    isSvg?: boolean
) {
    if (name === "key") {
    } else if (name === "style") {
        for (var i in merge(oldValue, newValue)) {
            var style = newValue == null || newValue[i] == null ? "" : newValue[i]
            if (i[0] === "-") {
                element[name].setProperty(i, style)
            } else {
                element[name][i as any] = style // NOTE: i is only number
            }
        }
    } else if (name === "class") {
        if ((newValue = createClass(newValue))) {
            element.setAttribute(name, newValue)
        } else {
            element.removeAttribute(name)
        }
    } else {
        if (name[0] === "o" && name[1] === "n") {
            if (!element.events) element.events = {}

            element.events[(name = name.slice(2).toLowerCase())] = newValue

            if (newValue == null) {
                element.removeEventListener(name, eventCb)
            } else if (oldValue == null) {
                element.addEventListener(name, eventCb)
            }
        } else {
            var nullOrFalse = newValue == null || newValue === false
            if (
                name in element &&
                name !== "list" &&
                name !== "draggable" &&
                name !== "spellcheck" &&
                name !== "translate" &&
                !isSvg
            ) {
                (element as any)[name] = newValue == null ? "" : newValue // NOTE:Element has not indexer
                if (nullOrFalse) {
                    element.removeAttribute(name)
                }
            } else {
                var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""))
                if (ns) {
                    if (nullOrFalse) {
                        element.removeAttributeNS(XLINK_NS, name)
                    } else {
                        element.setAttributeNS(XLINK_NS, name, newValue)
                    }
                } else {
                    if (nullOrFalse) {
                        element.removeAttribute(name)
                    } else {
                        element.setAttribute(name, newValue)
                    }
                }
            }
        }
    }
}

var createElement = function (node: VNode, eventCb: EventCb, isSvg?: boolean) {
    var element =
        node.type === TEXT_NODE
            ? document.createTextNode(node.name)
            : (isSvg = isSvg || node.name === "svg")
                ? document.createElementNS(SVG_NS, node.name)
                : document.createElement(node.name)

    for (var i = 0, length = node.children.length; i < length; i++) {
        element.appendChild(
            createElement(
                (node.children[i] = resolveNode(node.children[i])),
                eventCb,
                isSvg
            )
        )
    }

    var props = node.props
    for (var name in props) {
        updateProperty(<Element>element, name, null, props[name], eventCb, isSvg) // NOTE: not Text
    }

    return (node.element = element)
}

var updateElement = function (element: Element | Text, oldProps: VNodeProps, newProps: VNodeProps, eventCb: EventCb, isSvg: boolean) {
    for (var name in merge(oldProps, newProps)) {
        if (
            (name === "value" || name === "checked"
                ? (element as any)[name] // NOTE: Element has not indexer
                : oldProps[name]) !== newProps[name]
        ) {
            updateProperty(
                <Element>element,
                name,
                oldProps[name],
                newProps[name],
                eventCb,
                isSvg
            )
        }
    }
}

var removeElement = function (parent: Element | Text, node: VNode) {
    parent.removeChild(node.element!)
}

var getKey = function (node: VNode) {
    return node == null ? null : node.key
}

var createKeyMap = function (children: VNode[], start: number, end: number) {
    for (var out: any = {}, key, node; start <= end; start++) {
        if ((key = (node = children[start]).key) != null) {
            out[key] = node
        }
    }
    return out
}

var patchElement = function (parent: Element | Text, element: Element | Text, oldNode: VNode | null, newNode: VNode, eventCb: EventCb, isSvg?: boolean) {
    if (newNode === oldNode) {
    } else if (
        oldNode != null &&
        oldNode.type === TEXT_NODE &&
        newNode.type === TEXT_NODE
    ) {
        if (oldNode.name !== newNode.name) {
            element.nodeValue = newNode.name
        }
    } else if (oldNode == null || oldNode.name !== newNode.name) {
        var newElement = parent.insertBefore(
            createElement((newNode = resolveNode(newNode)), eventCb, isSvg),
            element
        )

        if (oldNode != null) removeElement(parent, oldNode)

        element = newElement
    } else {
        updateElement(
            element,
            oldNode.props,
            newNode.props,
            eventCb,
            (isSvg = isSvg || newNode.name === "svg")
        )

        var savedNode
        var childNode

        var oldKey
        var oldChildren = oldNode.children
        var oldChStart = 0
        var oldChEnd = oldChildren.length - 1

        var newKey
        var newChildren = newNode.children
        var newChStart = 0
        var newChEnd = newChildren.length - 1

        while (newChStart <= newChEnd && oldChStart <= oldChEnd) {
            oldKey = getKey(oldChildren[oldChStart])
            newKey = getKey(newChildren[newChStart])

            if (oldKey == null || oldKey !== newKey) break

            patchElement(
                element,
                oldChildren[oldChStart].element,
                oldChildren[oldChStart],
                (newChildren[newChStart] = resolveNode(
                    newChildren[newChStart],
                    oldChildren[oldChStart]
                )),
                eventCb,
                isSvg
            )

            oldChStart++
            newChStart++
        }

        while (newChStart <= newChEnd && oldChStart <= oldChEnd) {
            oldKey = getKey(oldChildren[oldChEnd])
            newKey = getKey(newChildren[newChEnd])

            if (oldKey == null || oldKey !== newKey) break

            patchElement(
                element,
                oldChildren[oldChEnd].element,
                oldChildren[oldChEnd],
                (newChildren[newChEnd] = resolveNode(
                    newChildren[newChEnd],
                    oldChildren[oldChEnd]
                )),
                eventCb,
                isSvg
            )

            oldChEnd--
            newChEnd--
        }

        if (oldChStart > oldChEnd) {
            while (newChStart <= newChEnd) {
                element.insertBefore(
                    createElement(
                        (newChildren[newChStart] = resolveNode(newChildren[newChStart++])),
                        eventCb,
                        isSvg
                    ),
                    (childNode = oldChildren[oldChStart]) && childNode.element
                )
            }
        } else if (newChStart > newChEnd) {
            while (oldChStart <= oldChEnd) {
                removeElement(element, oldChildren[oldChStart++])
            }
        } else {
            var oldKeyed = createKeyMap(oldChildren, oldChStart, oldChEnd)
            var newKeyed = {} as { [key: string]: boolean }

            while (newChStart <= newChEnd) {
                oldKey = getKey((childNode = oldChildren[oldChStart]))
                newKey = getKey(
                    (newChildren[newChStart] = resolveNode(
                        newChildren[newChStart],
                        childNode
                    ))
                )

                if (
                    newKeyed[oldKey!] ||
                    (newKey != null && newKey === getKey(oldChildren[oldChStart + 1]))
                ) {
                    if (oldKey == null) {
                        removeElement(element, childNode)
                    }
                    oldChStart++
                    continue
                }

                if (newKey == null || oldNode.type === RECYCLED_NODE) {
                    if (oldKey == null) {
                        patchElement(
                            element,
                            childNode && childNode.element,
                            childNode,
                            newChildren[newChStart],
                            eventCb,
                            isSvg
                        )
                        newChStart++
                    }
                    oldChStart++
                } else {
                    if (oldKey === newKey) {
                        patchElement(
                            element,
                            childNode.element,
                            childNode,
                            newChildren[newChStart],
                            eventCb,
                            isSvg
                        )
                        newKeyed[newKey] = true
                        oldChStart++
                    } else {
                        if ((savedNode = oldKeyed[newKey]) != null) {
                            patchElement(
                                element,
                                element.insertBefore(
                                    savedNode.element,
                                    childNode && childNode.element
                                ),
                                savedNode,
                                newChildren[newChStart],
                                eventCb,
                                isSvg
                            )
                            newKeyed[newKey] = true
                        } else {
                            patchElement(
                                element,
                                childNode && childNode.element,
                                null,
                                newChildren[newChStart],
                                eventCb,
                                isSvg
                            )
                        }
                    }
                    newChStart++
                }
            }

            while (oldChStart <= oldChEnd) {
                if (getKey((childNode = oldChildren[oldChStart++])) == null) {
                    removeElement(element, childNode)
                }
            }

            for (var key in oldKeyed) {
                if (newKeyed[key] == null) {
                    removeElement(element, oldKeyed[key])
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

var resolveNode = function (newNode: VNode, oldNode?: VNode) {
    return newNode.type === LAZY_NODE
        ? !oldNode || shouldUpdate(newNode.lazy, oldNode.lazy)
            ? newNode.render!()
            : oldNode
        : newNode
}

var createVNode = function (name: string, props: VNodeProps, children: any[], element: Element | undefined, key: string | null, type: VNodeType): VNode {
    return {
        name: name,
        props: props,
        children: children,
        element: element!,
        key: key,
        type: type
    }
}

var createTextVNode = function (text: string, element?: Element): TextVNode {
    return createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE) as TextVNode
}

var recycleChild = function (element: Element) {
    return element.nodeType === TEXT_NODE
        ? createTextVNode(element.nodeValue!, element)
        : recycleElement(element)
}

var recycleElement = function (element: Element): RecycledVNode {
    return createVNode(
        element.nodeName.toLowerCase(),
        EMPTY_OBJECT,
        map.call(element.childNodes, recycleChild),
        element,
        null,
        RECYCLED_NODE
    ) as RecycledVNode
}

var patch = function (container: Element, element: Element | Text, oldNode: VNode, newNode: VNode, eventCb: EventCb) {
    return (element = patchElement(container, element, oldNode, newNode, eventCb))
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

export var h = function (name: string | Function, props: any) {
    var node
    var rest = []
    var children = []
    var length = arguments.length

    while (length-- > 2) rest.push(arguments[length])

    if ((props = props == null ? {} : props).children != null) {
        if (rest.length <= 0) {
            rest.push(props.children)
        }
        delete props.children
    }

    while (rest.length > 0) {
        if (isArray((node = rest.pop()))) {
            for (length = node.length; length-- > 0;) {
                rest.push(node[length])
            }
        } else if (node === false || node === true || node == null) {
        } else {
            children.push(typeof node === "object" ? node : createTextVNode(node))
        }
    }

    return typeof name === "function"
        ? name(props, (props.children = children))
        : createVNode(name, props, children, undefined, props.key, DEFAULT_NODE) // NOTE: Element not null
}

var isSameAction = function (a: any, b: any) {
    return isArray(a) && isArray(b) && typeof a[0] === "function" && a[0] === b[0]
}

var shouldRestart = function (a: any, b: any) {
    for (var k in merge(a, b)) {
        if (a[k] === b[k] || isSameAction(a[k], b[k])) b[k] = a[k]
        else return true
    }
}

var patchSub = function (oldSub: any, newSub: any, dispatch: any): any {
    if (
        (newSub && (!newSub[0] || isArray(newSub[0]))) ||
        (oldSub && (!oldSub[0] || isArray(oldSub[0])))
    ) {
        var subs = []
        var newSubs = newSub ? newSub : [newSub]
        var oldSubs = oldSub ? oldSub : [oldSub]

        for (var i = 0; i < newSubs.length || i < oldSubs.length; i++) {
            subs.push(patchSub(oldSubs[i], newSubs[i], dispatch))
        }

        return subs
    }

    return newSub
        ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1])
            ? [
                newSub[0],
                newSub[1],
                newSub[0](newSub[1], dispatch),
                oldSub && oldSub[2]()
            ]
            : oldSub
        : oldSub && oldSub[2]()
}

export function app<S>(props: AppProps<S>) {
    var container = props.container
    var element: Element | Text = container && container.children[0]
    var oldNode: VNode = element && recycleElement(element)
    var subs = props.subscriptions
    var view = props.view
    var renderLock = false
    var state: S
    var sub: any

    var setState = function (newState: S) {
        if (!(state === newState || renderLock)) {
            renderLock = true
            defer(render)
        }
        state = newState
    }

    var dispatch: Dispatch<S> = function (obj: any, props?: any) {
        if (obj == null) {
        } else if (typeof obj === "function") {
            dispatch(obj(state, props))
        } else if (isArray(obj)) {
            if (typeof obj[0] === "function") {
                dispatch(obj[0](state, obj[1], props))
            } else {
                obj.slice(1).map(function (fx) {
                    fx[0](fx[1], dispatch)
                }, setState(obj[0]))
            }
        } else {
            setState(obj)
        }
    }

    var eventCb: EventCb = function (event) {
        (event.currentTarget! as any).events[event.type](event)
    }

    var render = function () {
        renderLock = false
        if (subs) sub = patchSub(sub, subs(state), dispatch)
        if (view) {
            element = patch(
                container,
                element,
                oldNode,
                (oldNode = view(state, dispatch)),
                eventCb
            )
        }
    }

    dispatch(props.init)
}

type EventCb = (ev: Event) => void

export type ActionResult<S> = S | [S, ...EffectObject<any, any>[]]
export type Action<S, P = undefined> = (state: S, params: P) => ActionResult<S>

export type EffectAction<S, P, R> = [Action<S, P & R>, P]

export type EffectRunner<RunnerProps, ReturnProps> = <S, P>(
    props: { action: EffectAction<S, P, ReturnProps> } & RunnerProps,
    dispatch: Dispatch<S>
) => void

export type EffectObject<RunnerProps, ReturnProps> = [EffectRunner<RunnerProps, ReturnProps>, RunnerProps]

export class Effect<Props, ReturnProps = {}, RunnerProps = Props> {
    public constructor(
        private runner: EffectRunner<Props, ReturnProps>,
        private creator: <S, P>(action: EffectAction<S, P, ReturnProps>, props: Props, runner: EffectRunner<Props, ReturnProps>) =>
            EffectObject<RunnerProps, ReturnProps>) {
    }

    create<S, P>(action: EffectAction<S, P, ReturnProps>, props: Props) {
        return this.creator(action, props, this.runner)
    }

    createAction<S, P>(action: Action<S, P & ReturnProps>): Action<S, P & ReturnProps> {
        return action
    }
}

export type SubscriptionRunner<RunnerProps, ReturnProps> = <S, P>(
    props: { action: EffectAction<S, P, ReturnProps> } & RunnerProps,
    dispatch: Dispatch<S>
) => () => void

export type SubscriptionObject<RunnerProps, ReturnProps> = [SubscriptionRunner<RunnerProps, ReturnProps>, RunnerProps]

export class Subscription<Props, ReturnProps = {}, RunnerProps = Props>{
    public constructor(
        private runner: SubscriptionRunner<Props, ReturnProps>,
        private creator: <S, P>(action: EffectAction<S, P, ReturnProps>, props: Props, runner: SubscriptionRunner<Props, ReturnProps>) =>
            SubscriptionObject<RunnerProps, ReturnProps>) {
    }

    create<S, P>(action: EffectAction<S, P, ReturnProps>, props: Props) {
        return this.creator(action, props, this.runner)
    }

    createAction<S, P = undefined>(action: Action<S, P & ReturnProps>): Action<S, P & ReturnProps> {
        return action
    }
}

export type SubscriptionType = SubscriptionObject<any, any> | boolean

export type SubscriptionsResult =
    | void
    | SubscriptionType
    | SubscriptionType[]

export type Dispatch<S> = {
    <P>(action: Action<S, P>, params: P): void
    (action: Action<S, undefined>): void
}

export type View<S> = (state: S, dispatch: Dispatch<S>) => VNode

export type AppProps<S> = {
    init: Action<S>,
    view?: View<S>,
    subscriptions?: (state: S) => SubscriptionsResult,
    container: Element
}

export type Children = VNode | string | number | null

export enum VNodeType {
    DEFAULT = 0,
    RECYCLED = 1,
    LAZY = 2,
    TEXT = 3,
}

export type VNodeProps = { [key: string]: any }

export interface VNode<Props extends VNodeProps = VNodeProps> {
    name: string,
    props: Props,
    children: Array<VNode>
    element: Element | Text,
    key: string | null,
    type: VNodeType,
    lazy?: any
    render?: () => VNode
}

export interface TextVNode extends VNode {
    type: VNodeType.TEXT
}

export interface RecycledVNode extends VNode {
    type: VNodeType.RECYCLED
}

export interface LazyVNode<P> extends VNode {
    lazy: P
    render: () => VNode
}

export function mergeState<S, N extends keyof S>(state: S, key: N, value: (v: S[N]) => S[N]): S {
    return {
        ...state,
        [key]: value(state[key]),
    }
}
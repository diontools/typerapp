// forked from https://github.com/morishitter/picostyle

import { h, VNode } from '..'
import * as CSS from 'csstype'

let _id = 0
export const styleRoot = document.head.appendChild(document.createElement("style"))
const sheet = <CSSStyleSheet>styleRoot.sheet

function hyphenate(str: string) {
    return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule: string) {
    sheet.insertRule(rule, sheet.cssRules.length)
}

function createStyle(obj: any) {
    var id = "p" + _id++
    parse(obj, "." + id).forEach(insert)
    return id
}

function wrap(stringToWrap: string, wrapper: string) {
    return wrapper + "{" + stringToWrap + "}"
}

function parse(obj: any, classname: string, isInsideObj?: any) {
    const arr = [""]
    isInsideObj = isInsideObj || 0
    for (let prop in obj) {
        const value = obj[prop]
        prop = hyphenate(prop)
        // Same as typeof value === 'object', but smaller
        if (!value.sub && !Array.isArray(value)) {
            if (/^(:|>|\.|\*)/.test(prop)) {
                prop = classname + prop
            }
            // replace & in "&:hover", "p>&"
            prop = prop.replace(/&/g, classname)
            arr.push(
                wrap(parse(value, classname, 1 && !/^@/.test(prop)).join(""), prop)
            )
        } else {
            const values = Array.isArray(value) ? value : [value]
            values.forEach(function (value) {
                return (arr[0] += prop + ":" + value + ";")
            })
        }
    }
    if (!isInsideObj) {
        arr[0] = wrap(arr[0], classname)
    }
    return arr
}

export type PseudoKey = string

export type Style =
    CSS.Properties<string | number>
    | { [key: string]: CSS.Properties<string | number> }

export default function <K extends keyof HTMLElementTagNameMap>(nodeName: K) {
    var cache: { [key: string]: string } = {}
    return function (decls: ((props: any) => Style) | Style) {
        return function (props?: any, children?: VNode[]) {
            props = props || {}
            //children = attributes.children || children
            var nodeDecls = typeof decls == "function" ? decls(props) : decls
            var key = JSON.stringify(nodeDecls)
            cache[key] || (cache[key] = createStyle(nodeDecls))
            props.class = [cache[key], props.class].filter(Boolean).join(" ")
            return h(nodeName, props, children)
        }
    }
}

export function keyframes(obj: any) {
    var id = "p" + _id++
    insert(wrap(parse(obj, id, 1).join(""), "@keyframes " + id))
    return id
}
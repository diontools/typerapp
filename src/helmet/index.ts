import { h, VNode, VNodeType, convName } from '..'

function debug(...args: any[]) {
    //console.log(...args)
}

export function Helmet(props: {}, children: VNode[]) {
    updateNodes(children, document.head)
    return h('template', {})
}

function createElement(node: VNode): Element | Text {
    if (node.type === VNodeType.TEXT) {
        return document.createTextNode(node.name)
    } else {
        const element = document.createElement(node.name)
        for (const key in node.props) {
            element.setAttribute(convName(key), node.props[key])
        }
        for (const child of node.children) {
            element.appendChild(createElement(child))
        }
        return element
    }
}

function updateElement(vNode: VNode, element: Element) {
    const usedNames: string[] = []
    for (const key in vNode.props) {
        const value = vNode.props[key]
        const name = convName(key)
        if (value) {
            const attr = element.getAttributeNode(name)
            if (attr) {
                if (value !== attr.value) {
                    debug('update', vNode, name, value)
                    attr.value = value
                }
            } else {
                debug('create attr', vNode, name, value)
                element.setAttribute(name, value)
            }
            usedNames.push(name)
        } else {
            debug('remove attr', vNode, name)
            element.removeAttribute(name)
        }
    }

    for (let i = 0; i < element.attributes.length;) {
        const attr = element.attributes[i]
        if (usedNames.includes(attr.name)) {
            i++
        } else {
            debug('remove attr', element, name)
            element.removeAttributeNode(attr)
        }
    }

    updateNodes(vNode.children, element)
}

function updateNodes(children: VNode[], parentNode: Node) {
    for (let i = 0; i < children.length; i++) {
        const vNode = children[i]
        if (i < parentNode.childNodes.length) {
            const childNode = parentNode.childNodes[i]
            if (childNode.nodeType === childNode.TEXT_NODE) {
                const childText = <Text>childNode
                if (vNode.type === VNodeType.TEXT) {
                    // update text
                    if (vNode.name !== childText.textContent) {
                        debug('update text', vNode)
                        childText.textContent = vNode.name
                    }
                } else {
                    // replace
                    debug('replace', i, vNode)
                    parentNode.replaceChild(createElement(vNode), childNode)
                }
            } else {
                const childElement = <Element>childNode
                if (vNode.name === childElement.localName) {
                    // update
                    updateElement(vNode, childElement)
                } else {
                    // replace
                    debug('replace', i, vNode)
                    parentNode.replaceChild(createElement(vNode), childElement)
                }
            }
        } else {
            // add
            debug('add', i, vNode)
            parentNode.appendChild(createElement(vNode))
        }
    }

    // clean up
    for (let i = children.length; i < parentNode.childNodes.length;) {
        debug('remove', parentNode.childNodes.length - 1, parentNode.childNodes[parentNode.childNodes.length - 1])
        parentNode.removeChild(parentNode.childNodes[parentNode.childNodes.length - 1])
    }
}
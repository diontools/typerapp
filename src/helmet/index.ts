import { h, VNode, VNodeType } from '..'

export function Helmet(props: {}, children: VNode[]) {
    updateNodes(children, document.head)
    return h('template', {})
}

function createAttr(name: string, value: string): Attr {
    const attr = document.createAttribute(name)
    attr.value = value
    return attr
}

function createElement(node: VNode): Element | Text {
    if (node.type === VNodeType.TEXT) {
        return document.createTextNode(node.name)
    } else {
        const element = document.createElement(node.name)
        for (const key in node.props) {
            element.attributes.setNamedItem(createAttr(key, node.props[key]))
        }
        for (const child of node.children) {
            element.appendChild(createElement(child))
        }
        return element
    }
}

function updateElement(vNode: VNode, element: Element) {
    for (const key in getKeys(vNode.props, element.attributes)) {
        const propValue = vNode.props[key]
        if (propValue) {
            const elementValue = element.attributes.getNamedItem(key)!
            if (elementValue) {
                if (propValue !== elementValue.value) {
                    console.log('update', vNode, key, propValue)
                    elementValue.value = propValue
                }
            } else {
                console.log('create attr', vNode, key, propValue)
                element.attributes.setNamedItem(createAttr(key, propValue))
            }
        } else {
            console.log('remove attr', vNode, key)
            element.attributes.removeNamedItem(key)
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
                        console.log('update text', vNode)
                        childText.textContent = vNode.name
                    }
                } else {
                    // replace
                    console.log('replace', i, vNode)
                    parentNode.replaceChild(createElement(vNode), childNode)
                }
            } else {
                const childElement = <Element>childNode
                if (vNode.name === childElement.localName) {
                    // update
                    updateElement(vNode, childElement)
                } else {
                    // replace
                    console.log('replace', i, vNode)
                    parentNode.replaceChild(createElement(vNode), childElement)
                }
            }
        } else {
            // add
            console.log('add', i, vNode)
            parentNode.appendChild(createElement(vNode))
        }
    }

    // clean up
    for (let i = children.length; i < parentNode.childNodes.length;) {
        console.log('remove', parentNode.childNodes.length - 1, parentNode.childNodes[parentNode.childNodes.length - 1])
        parentNode.removeChild(parentNode.childNodes[parentNode.childNodes.length - 1])
    }
}

function getKeys(obj: any, n: NamedNodeMap) {
    var target = <any>{}

    for (let i = 0; i < n.length; i++) {
        target[n[i].name] = 1
    }

    for (let i in obj) target[i] = 1

    return target
}
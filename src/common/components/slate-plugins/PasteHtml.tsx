import { Plugin, getEventTransfer } from "slate-react";
import Html, { Rule } from "slate-html-serializer";

const BLOCK_TAGS:{[key:string]:string} = {
    p: 'paragraph',
    li: 'list-item',
    ul: 'unordered-list',
    ol: 'ordered-list',
    blockquote: 'block-quote',
    h1: 'heading-one',
    h2: 'heading-two',
    h3: 'heading-two',
    h4: 'heading-two',
    h5: 'heading-two',
    h6: 'heading-two',
}


const MARK_TAGS:{[key:string]:string} = {
    strong: 'bold',
    em: 'italic',
    u: 'underline',
    code: 'code',
}

const RULES:Rule[] = [
    {
        // Special case for code blocks, which need to grab the nested childNodes.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'pre') {
                const code = el.childNodes[0];
                console.log(code)
                const childNodes =
                    code && code.tagName.toLowerCase() === 'code'
                        ? code.childNodes
                        : el.childNodes

                return {
                    object: 'block',
                    type: 'code-block',
                    nodes: next(childNodes),
                }
            }
        },
    },
    {
        deserialize(el, next) {
            const block = BLOCK_TAGS[el.tagName.toLowerCase()]

            if (block) {
                return {
                    object: 'block',
                    type: block,
                    nodes: next(el.childNodes),
                }
            }
        },
    },
    {
        deserialize(el, next) {
            const mark = MARK_TAGS[el.tagName.toLowerCase()]

            if (mark) {
                return {
                    object: 'mark',
                    type: mark,
                    nodes: next(el.childNodes),
                }
            }
        },
    },
    {
        // Special case for images, to grab their src.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'img') {
                return {
                    object: 'block',
                    type: 'image',
                    nodes: next(el.childNodes),
                    data: {
                        url: el.getAttribute('src'),
                    },
                }
            }
        },
    },
    {
        // Special case for links, to grab their href.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'a') {
                return {
                    object: 'inline',
                    type: 'link',
                    nodes: next(el.childNodes),
                    data: {
                        href: el.getAttribute('href'),
                    },
                }
            }
        },
    },
]

const serializer = new Html({ rules: RULES})

export default (): Plugin => {
    return {
        onPaste: (event, editor, next) => {
            const transfer = getEventTransfer(event)
            if (transfer.type !== 'html') return next()
            const { document } = serializer.deserialize(transfer.html)
            editor.insertFragment(document)
        }
    }
}
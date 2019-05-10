import { languages as prismLanguages, Token, tokenize, TokenStream } from 'prismjs';
import { Text } from 'slate';
import { Plugin } from 'slate-react';

const processTokens = (tokens: TokenStream, offset: number, baseClass: string) => {
    const result: Array<{ start: number, end: number, className: string, text: string }> = []
    if (tokens instanceof Array) {
        tokens.forEach(token => {
            const res = processTokens(token, offset, baseClass);
            result.push(...res);
            offset += token.length
        })
    } else if (tokens instanceof Token) {
        const { content, type, alias } = tokens
        const currentClass = [baseClass, type, ...(alias instanceof Array ? alias : [alias])].filter(s => s && s.length > 0).join(' ');
        const res = processTokens(content, offset, currentClass);
        result.push(...res)
    } else {
        if (baseClass && baseClass.length > 0) {
            result.push({
                className: baseClass,
                start: offset,
                end: offset + tokens.length,
                text: tokens
            })
        }
    }
    return result;
}

const CodeHighlighter = (
    { nodeType }:
        { nodeType: string}
): Plugin => {
    return {
        decorateNode: (node, editor, next) => {
            if (node instanceof Text || node.type !== nodeType || node.object !== 'block') {
                return next();
            }
            const language = node.data.get('language')

            if(!prismLanguages[language]){
                return next()
            }
            const { text } = node;
            const tokens = tokenize(text, prismLanguages[language]);
            const { key } = node.getTexts().get(0);
            const decorations = processTokens(tokens, 0, '')
                .map(({ className, start, end }) => ({
                    anchor: {
                        key,
                        offset: start
                    },
                    focus: {
                        key,
                        offset: end
                    },
                    mark: {
                        type: 'prism-token',
                        data: { className }
                    }
                }));
            return decorations;
        },
        renderMark: (props, editor, next) => {
            const { children, mark, attributes } = props
            if (mark.type !== 'prism-token') {
                return next();
            }
            return (
                <span {...attributes} className={"token " + mark.data.get('className')}>{children}</span>
            )
        }
    }
}

export default CodeHighlighter;
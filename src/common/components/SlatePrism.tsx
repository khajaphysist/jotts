import { List, Record } from 'immutable';
import Prism from 'prismjs';
import * as React from 'react';
import { DecorationProperties, Mark, Node, Range, Text } from 'slate';
import { Plugin } from 'slate-react';

const TOKEN_MARK = 'prism-token';

export interface OptionsFormat {
    // Determine which node should be highlighted
    onlyIn?: (node: Node) => boolean;
    // Returns the syntax for a node that should be highlighted
    getSyntax?: (node: Node) => string;
    // Render a highlighting mark in a highlighted node
    renderMark?: (mark: {
        mark: Mark;
        children: React.ReactNode;
    }) => React.ReactNode;
}

/*
 * Default filter for code blocks
 */

function defaultOnlyIn(node: Node): boolean {
    return node.object === 'block' && node.type === 'code_block';
}

/*
 * Default getter for syntax
 */

function defaultGetSyntax(node: Node): string {
    return 'javascript';
}

/*
 * Default rendering for marks
 */

function defaultRenderMark(props: {
    children: React.ReactNode;
    mark: Mark;
}): void | React.ReactNode {
    const { mark } = props;

    if (mark.type !== TOKEN_MARK) {
        return undefined;
    }

    const className = mark.data.get('className');
    return <span className={className}>{props.children}</span>;
}

/*
 * The plugin options
 */

class Options extends Record({
    onlyIn: defaultOnlyIn,
    getSyntax: defaultGetSyntax,
    renderMark: defaultRenderMark
}) {
    // public onlyIn: (node: Node) => boolean;
    // public getSyntax: (node: Node) => string;
    // public renderMark: (props: {
    //     mark: Mark;
    //     children: React.ReactNode;
    // }) => React.ReactNode;
}

function PrismPlugin(optsParam: OptionsFormat = {}): Plugin {
    const opts = new Options(optsParam);

    return {
        decorateNode: (node: Node) => {
            if (!opts.onlyIn(node)) {
                return undefined;
            }
            return decorateNode(opts, node);
        },

        renderMark: opts.renderMark,
    };
}

/*
 * Returns the decoration for a node
 */
function decorateNode(opts: Options, node: Node) {
    const grammarName = opts.getSyntax(node);
    const grammar = Prism.languages[grammarName];

    if (!grammar) {
        // Grammar not loaded
        return [];
    }

    // Tokenize the whole block text
    const texts = node instanceof Text ? List<Text>([node]) : node.getTexts();
    const blockText = node.text.replace('\n', '');
    const tokens = Prism.tokenize(blockText, grammar);

    // The list of decorations to return
    const decorations: DecorationProperties[] = [];
    let textStart = 0;
    let textEnd = 0;

    texts.forEach((text: Text) => {
        textEnd = textStart + text.text.length;

        let offset = 0;

        function processToken(token: string | Prism.Token, accu: string) {
            accu = accu || '';

            if (typeof token === 'string') {
                if (accu) {
                    const decoration = createDecoration({
                        text,
                        textStart,
                        textEnd,
                        start: offset,
                        end: offset + token.length,
                        className: `prism-token token ${accu}`
                    });

                    if (decoration) {
                        decorations.push(decoration);
                    }
                }

                offset += token.length;
            } else {
                accu = `${accu} ${token.type} ${token.alias || ''}`;

                if (typeof token.content === 'string') {
                    const decoration = createDecoration({
                        text,
                        textStart,
                        textEnd,
                        start: offset,
                        end: offset + token.content.length,
                        className: `prism-token token ${accu}`
                    });

                    if (decoration) {
                        decorations.push(decoration);
                    }

                    offset += token.content.length;
                } else {
                    // When using token.content instead of token.matchedStr, token can be deep
                    for (const item of token.content) {
                        processToken(item, accu);
                    }
                }
            }
        }

        tokens.forEach(processToken);
        textStart = textEnd + 1; // account for added `\n`
    });

    return decorations;
}

/*
 * Return a decoration range for the given text.
 */
function createDecoration({
    text,
    textStart,
    textEnd,
    start,
    end,
    className
}: {
    text: Text; // The text being decorated
    textStart: number; // Its start position in the whole text
    textEnd: number; // Its end position in the whole text
    start: number; // The position in the whole text where the token starts
    end: number; // The position in the whole text where the token ends
    className: string; // The prism token classname
}): Range | null {
    if (start >= textEnd || end <= textStart) {
        // Ignore, the token is not in the text
        return null;
    }

    // Shrink to this text boundaries
    start = Math.max(start, textStart);
    end = Math.min(end, textEnd);

    // Now shift offsets to be relative to this text
    start -= textStart;
    end -= textStart;

    return {
        anchorKey: text.key,
        anchorOffset: start,
        focusKey: text.key,
        focusOffset: end,
        marks: [{ type: 'prism-token', data: { className } }]
    };
}

export default PrismPlugin;
import { isKeyHotkey } from 'is-hotkey';
import Prism from 'prismjs';
import { Editor, Value } from 'slate';
import { getEventTransfer, Plugin } from 'slate-react';

import { Divider, IconButton, Paper, Theme, Typography } from '@material-ui/core';
import FormatCodeIcon from '@material-ui/icons/Code';
import DvrIcon from '@material-ui/icons/Dvr';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FormatUnderlineIcon from '@material-ui/icons/FormatUnderlined';
import FormatTitleIcon from '@material-ui/icons/Title';

const getMarkToggleFromHotKey = (event: any): MarkType | undefined => {
    switch (true) {
        case isKeyHotkey('mod+b')(event):
            return 'bold'
        case isKeyHotkey('mod+i')(event):
            return 'italic'
        case isKeyHotkey('mod+u')(event):
            return 'underline'
        case isKeyHotkey('mod+`')(event):
            return 'code'
        default:
            return undefined
    }
}

const isHotKey = (event: any, key: string) => isKeyHotkey(key)(event);

const DEFAULT_NODE = 'paragraph'

const markTypes = ['bold', 'italic', 'underline', 'code'] as const;
const nodeTypes = ['heading-one', 'heading-two', 'block-quote', 'code-block'] as const;

type MarkType = typeof markTypes[number];
type NodeType = typeof nodeTypes[number];

const hasMark = (type: MarkType, value: Value) =>
    value.activeMarks.some(mark => mark !== undefined && mark.type === type)

const hasBlock = (type: NodeType, value: Value) =>
    value.blocks.some(node => node !== undefined && node.type === type)

const getMarkBtnColor = (type: MarkType, value: Value) =>
    hasMark(type, value) ? 'secondary' : 'disabled';

const getNodeBtnColor = (type: NodeType, value: Value) =>
    hasBlock(type, value) ? 'secondary' : 'disabled';

const getFormatMarkBtn = (type: MarkType, editor: Editor) => {
    const { value } = editor
    const icon = (() => {
        switch (type) {
            case 'bold':
                return (<FormatBoldIcon color={getMarkBtnColor(type, value)} />);
            case 'italic':
                return (<FormatItalicIcon color={getMarkBtnColor(type, value)} />);
            case 'underline':
                return (<FormatUnderlineIcon color={getMarkBtnColor(type, value)} />);
            case 'code':
                return (<FormatCodeIcon color={getMarkBtnColor(type, value)} />);
        }
    })();
    return (
        <IconButton onClick={e => {
            e.preventDefault();
            editor.toggleMark(type)
            editor.focus()
        }}>
            {icon}
        </IconButton>
    )
}

const getFormatNodeBtn = (type: NodeType, editor: Editor) => {
    const { value } = editor
    const icon = (() => {
        switch (type) {
            case 'heading-one':
                return (<FormatTitleIcon color={getNodeBtnColor(type, value)} />);
            case 'heading-two':
                return (<FormatTitleIcon color={getNodeBtnColor(type, value)} fontSize='small' />);
            case 'block-quote':
                return (<FormatQuoteIcon color={getNodeBtnColor(type, value)} />);
            case 'code-block':
                return (<DvrIcon color={getNodeBtnColor(type, value)} />);
        }
    })();
    return icon ? (
        <IconButton onClick={e => {
            e.preventDefault();
            editor.setBlocks(hasBlock(type, value) ? DEFAULT_NODE : type)
            editor.focus()
        }}>
            {icon}
        </IconButton>
    ) : null
}

export default ({ theme }: { theme: Theme }): Plugin => {
    const languages = Object.keys(Prism.languages).sort();
    return {
        renderEditor: (props, editor, next) => {
            const children = next();
            return (
                <Paper>
                    {
                        editor.readOnly ? null :
                            <div>
                                <div style={{ display: 'flex' }}>
                                    {getFormatNodeBtn('heading-one', editor)}
                                    {getFormatNodeBtn('heading-two', editor)}
                                    {getFormatMarkBtn('bold', editor)}
                                    {getFormatMarkBtn('italic', editor)}
                                    {getFormatMarkBtn('underline', editor)}
                                    {getFormatNodeBtn('block-quote', editor)}
                                    {getFormatMarkBtn('code', editor)}
                                    {getFormatNodeBtn('code-block', editor)}
                                </div>
                                <Divider />
                            </div>
                    }
                    <div style={{ padding: 2 * theme.spacing.unit }}>
                        {children}
                    </div>
                </Paper>
            )
        },
        renderMark: (props, editor, next) => {
            const { attributes, children, mark } = props

            switch (mark.type) {
                case 'bold':
                    return <strong {...attributes}>{children}</strong>
                case 'italic':
                    return <em {...attributes}>{children}</em>
                case 'underline':
                    return <u {...attributes}>{children}</u>
                case 'code':
                    return (
                        <code
                            {...attributes}
                            style={{
                                backgroundColor: '#eeeeee',
                                color: theme.palette.secondary.dark,
                            }}
                        >{children}</code>
                    )
                default:
                    return next()
            }
        },
        renderNode: (props, editor, next) => {
            const { attributes, children, node } = props

            switch (node.type) {
                case 'paragraph':
                    return <Typography {...attributes} variant='body1'>{children}</Typography>
                case 'block-quote':
                    return <blockquote
                        style={{
                            color: theme.palette.text.secondary,
                            borderLeft: '0.2em solid ' + theme.palette.secondary.light,
                            paddingLeft: theme.spacing.unit,
                            margin: 0,
                        }}><Typography {...attributes} variant="subtitle1">{children}</Typography></blockquote>
                case 'heading-one':
                    return <Typography {...attributes} variant="h1">{children}</Typography>
                case 'heading-two':
                    return <Typography {...attributes} variant="h2">{children}</Typography>
                case 'code-block':
                    let language = node.data.get('language');
                    if (!language) {
                        language = 'javascript';
                        editor.setNodeByKey(node.key, { data: { language }, type: node.type })
                    }
                    return (
                        <div>
                            {
                                editor.readOnly ? null :
                                    (
                                        <select
                                            defaultValue={language}
                                            onChange={(event) => {
                                                event.preventDefault()
                                                editor.setNodeByKey(node.key, { data: { language: event.target.value }, type: node.type })
                                            }}>
                                            {languages.map(l => (
                                                <option key={l}>{l}</option>
                                            ))}
                                        </select>
                                    )
                            }
                            <pre className={'language-' + language}>
                                <code className={'language-' + language} {...attributes}>
                                    {children}
                                </code>
                            </pre>
                        </div>
                    )
                default:
                    return next()
            }
        },

        onKeyDown: (event, editor, next) => {
            const mark = getMarkToggleFromHotKey(event)
            if (mark) {
                event.preventDefault()
                editor.toggleMark(mark)
                return;
            }

            if (editor.value.startBlock.type === 'code-block' && isHotKey(event, 'enter')) {
                editor.insertText('\n');
                return;
            }

            if (isHotKey(event, 'shift+enter')) {
                next()
                editor.setBlocks(DEFAULT_NODE)
                return;
            }

            return next()
        },
        onPaste: (event, editor, next) => {
            const transfer: any = getEventTransfer(event);
            if (editor.value.startBlock.type === 'code-block') {
                editor.insertText(transfer.text ? transfer.text : '');
                return;
            }
            return next()
        }
    }
}
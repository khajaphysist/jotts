import { isKeyHotkey } from 'is-hotkey';
import { Editor, Value } from 'slate';
import { getEventTransfer, Plugin } from 'slate-react';

import {
    Divider, IconButton, Paper, TextField, Theme, Tooltip, Typography
} from '@material-ui/core';
import {
    Code as CodeIcon, Dvr as DvrIcon, FormatBold as FormatBoldIcon, FormatItalic as FormatItalicIcon,
    FormatQuote as FormatQuoteIcon, FormatUnderlined as FormatUnderlineIcon, Highlight, Image, Link,
    Title as TitleIcon, List
} from '@material-ui/icons';

import { languages as prismLanguages } from '../../../lib/prism';
import CustomToolTip from '../CustomToolTip';
import EditImage from './EditImage';

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

const markTypes = ['bold', 'italic', 'underline', 'code', 'highlight'] as const;
const nodeTypes = ['heading-one', 'heading-two', 'block-quote', 'code-block', 'image', 'link'] as const;

type MarkType = typeof markTypes[number];
type NodeType = typeof nodeTypes[number];

const hasMark = (type: MarkType, value: Value) =>
    value.activeMarks.some(mark => mark !== undefined && mark.type === type)

const hasBlock = (type: NodeType, value: Value) =>
    value.blocks.some(node => node !== undefined && node.type === type)

const hasInline = (type: NodeType, value: Value) =>
    value.inlines.some(node => node !== undefined && node.type === type)

const getMarkBtnColor = (type: MarkType, value: Value) =>
    hasMark(type, value) ? 'secondary' : 'disabled';

const getBlockBtnColor = (type: NodeType, value: Value) =>
    hasBlock(type, value) ? 'secondary' : 'disabled';

const getInlineBtnColor = (type: NodeType, value: Value) =>
    hasInline(type, value) ? 'secondary' : 'disabled';

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
                return (<CodeIcon color={getMarkBtnColor(type, value)} />);
            case 'highlight':
                return (<Highlight color={getMarkBtnColor(type, value)} />);
        }
    })();
    return (
        <Tooltip
            title={type}
            enterDelay={200}
        >
            <IconButton onClick={e => {
                e.preventDefault();
                editor.toggleMark(type)
                editor.focus()
            }}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}

const getFormatNodeBtn = (type: NodeType, editor: Editor) => {
    const { value } = editor
    const icon = (() => {
        switch (type) {
            case 'heading-one':
                return (<TitleIcon color={getBlockBtnColor(type, value)} />);
            case 'heading-two':
                return (<TitleIcon color={getBlockBtnColor(type, value)} fontSize='small' />);
            case 'block-quote':
                return (<FormatQuoteIcon color={getBlockBtnColor(type, value)} />);
            case 'code-block':
                return (<DvrIcon color={getBlockBtnColor(type, value)} />);
            case 'image':
                return (<Image color={getBlockBtnColor(type, value)} />);
        }
    })();
    return icon ? (
        <Tooltip
            title={type}
            enterDelay={200}
        >
            <IconButton onClick={e => {
                e.preventDefault();
                editor.setBlocks(hasBlock(type, value) ? DEFAULT_NODE : type)
                // hasBlock(type, value)? editor.unwrapBlock(type):editor.wrapBlock(type)
                editor.focus()
            }}>
                {icon}
            </IconButton>
        </Tooltip>
    ) : null
}

export default ({ theme }: { theme: Theme }): Plugin => {
    const languages = Object.keys(prismLanguages).sort();
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
                                    {getFormatMarkBtn('highlight', editor)}
                                    <Tooltip
                                        title='link'
                                        enterDelay={200}
                                    >
                                        <IconButton onClick={e => {
                                            e.preventDefault();
                                            hasInline('link', editor.value) ?
                                                editor.unwrapInline('link') :
                                                editor.wrapInline({
                                                    type: 'link',
                                                    data: {
                                                        href: 'https://'
                                                    }
                                                })
                                            editor.focus()
                                        }}>
                                            <Link color={getInlineBtnColor('link', editor.value)} />
                                        </IconButton>
                                    </Tooltip>
                                    {getFormatNodeBtn('block-quote', editor)}
                                    {getFormatMarkBtn('code', editor)}
                                    {getFormatNodeBtn('code-block', editor)}
                                    {getFormatNodeBtn('image', editor)}
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
                case 'highlight':
                    return <mark {...attributes}>{children}</mark>
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
                    return <Typography {...attributes} variant='body1' style={{ marginBottom: 2 * theme.spacing.unit }}>{children}</Typography>
                case 'block-quote':
                    return <Typography
                        {...attributes}
                        variant="subtitle1"
                        component="blockquote"
                        style={{
                            color: theme.palette.text.secondary,
                            borderLeft: '0.2em solid ' + theme.palette.secondary.light,
                            paddingLeft: theme.spacing.unit,
                            margin: 0,
                            marginBottom: 2 * theme.spacing.unit,
                        }}
                    >
                        {children}
                    </Typography>
                case 'heading-one':
                    return (
                        <div style={{ marginBottom: 2 * theme.spacing.unit }}>
                            <Typography {...attributes} variant="h4" component="h1" gutterBottom>{children}</Typography>
                            <Divider />
                        </div>
                    )
                case 'heading-two':
                    return <Typography
                        {...attributes}
                        variant="h5"
                        component="h2"
                        style={{
                            marginBottom: 2 * theme.spacing.unit,
                        }}
                    >{children}
                    </Typography>
                case 'code-block':
                    let language = node.data.get('language');
                    if (!language) {
                        language = 'javascript';
                        editor.setNodeByKey(node.key, { data: { language }, type: node.type })
                    }
                    return (
                        <div style={{ marginBottom: 2 * theme.spacing.unit }} className={'line-numbers'}>
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
                                <code className={'language-' + language} {...attributes} style={{ overflow: 'auto' }}>
                                    {editor.readOnly ? node.text : children}
                                </code>
                            </pre>
                        </div>
                    )
                case 'image':
                    return (
                        <div style={{
                            margin: 4 * theme.spacing.unit
                        }}>
                            <EditImage editor={editor} node={node} />
                            <Typography variant="subtitle2" {...attributes} align="center" color="textSecondary">
                                {node.text.length > 0 ? null : (
                                    <span contentEditable={false}>
                                        Caption...
                                    </span>
                                )}
                                {children}
                            </Typography>
                        </div>
                    )
                case 'link':
                    return (editor.readOnly ?
                        <a {...attributes} href={node.data.get('href')} target="_blank">{children}</a>
                        :
                        <CustomToolTip
                            interactive
                            enterDelay={200}
                            leaveDelay={200}
                            title={
                                <Paper>
                                    <TextField
                                        label="Url"
                                        value={node.data.get('href')}
                                        onChange={event => editor.setNodeByKey(node.key, { data: { href: event.target.value }, type: node.type })}
                                    />
                                </Paper>
                            }
                        >
                            <a {...attributes} href={node.data.get('href')} target="_blank">{children}</a>
                        </CustomToolTip>
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
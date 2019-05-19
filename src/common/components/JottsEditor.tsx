import Prism from '../../lib/prism';
import React from 'react';
import { Value } from 'slate';
import { Editor, EditorProps, Plugin } from 'slate-react';

import { createStyles, WithStyles, withStyles } from '@material-ui/core';

import CodeHighlighter from './slate-plugins/CodeHighlighter';
import RichTextEditor from './slate-plugins/RichTextEditor';

const styles = () => createStyles({
});

interface ComponentProps extends EditorProps { };

type StyleProps = WithStyles<typeof styles, true>

type Props = StyleProps & ComponentProps

export type EditorValue = Value;

class JottsEditor extends React.Component<Props> {
    private plugins: Plugin[]
    constructor(props: Props) {
        super(props)
        this.plugins = [RichTextEditor({ theme: this.props.theme }), CodeHighlighter({ nodeType: 'code-block' })];
        // Prism.hooks.add('complete', () => this.forceUpdate());
    }

    render() {
        return (<Editor {...this.props} plugins={this.plugins} />)
    }
    componentDidMount(){
        if(this.props.readOnly){
            Prism.highlightAll()
        }
    }
}

export function serializeValue(value: Value): string {
    return JSON.stringify(value.toJSON())
}

export function deserializeValue(s: string): Value {
    try {
        return Value.fromJSON(JSON.parse(s))
    } catch (error) {
        console.log(error)
        return createMessageValue("Some error occurred when deserializing")
    }
}

export function createMessageValue(message: string): Value {
    return Value.fromJSON(
        {
            document: {
                nodes: [
                    {
                        object: 'block' as const,
                        type: 'paragraph',
                        nodes: [
                            {
                                object: 'text' as const,
                                leaves: [
                                    {
                                        object: 'leaf',
                                        text: message,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        }
    )
}

export default withStyles(styles, { withTheme: true })(JottsEditor)
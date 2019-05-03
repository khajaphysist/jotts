import '../../static/prism.css';

import React from 'react';
import { Value } from 'slate';
import { Editor, Plugin } from 'slate-react';

import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

import { getCodeHighlighter } from './SlateCodeHighlighter';
import { rtePlugin } from './SlatePlugins';

const styles = (theme: Theme) => createStyles({
});

type StyleProps = WithStyles<typeof styles, true>

type Props = StyleProps

interface State {
    value: Value,
}

const localString = localStorage.getItem('content')

const initialValue = Value.fromJSON(
    localString ? JSON.parse(localString) : undefined
        ||
        {
            document: {
                nodes: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        nodes: [
                            {
                                object: 'text',
                                leaves: [
                                    {
                                        text: 'A line of text in a paragraph.',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        });

class JottsEditor extends React.Component<Props, State> {
    private plugins: Plugin[]
    constructor(props: Props) {
        super(props)
        this.state = {
            value: initialValue
        }
        this.plugins = [rtePlugin({ theme: this.props.theme }), getCodeHighlighter({nodeType: 'code-block'})];
    }

    render() {
        const { classes } = this.props;
        return (
            <Editor
                value={this.state.value}
                onChange={({ value }) => {
                    if (value.document != this.state.value.document) {
                        localStorage.setItem('content', JSON.stringify(value.toJSON()))
                        console.log("writing...")
                    }
                    this.setState({ ...this.state, value })
                }}
                plugins={this.plugins}
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(JottsEditor)
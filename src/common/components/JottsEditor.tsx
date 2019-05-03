import '../../static/prism.css';

import React from 'react';
import { Value } from 'slate';
import { Editor, Plugin } from 'slate-react';

import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

import getCodeHighlighter from './SlateCodeHighlighter';
import { rtePlugin } from './SlatePlugins';
import Prism from 'prismjs';

const styles = (theme: Theme) => createStyles({
});

type StyleProps = WithStyles<typeof styles, true>

type Props = StyleProps

interface State {
    value: Value,
    display: boolean,
}

const initialValue = () => {
    const localString = localStorage.getItem('content')
    return Value.fromJSON(
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
            })
};

class JottsEditor extends React.Component<Props, State> {
    private plugins: Plugin[]
    constructor(props: Props) {
        super(props)
        this.state = {
            value: initialValue(),
            display: true
        }
        this.plugins = [rtePlugin({ theme: this.props.theme }), getCodeHighlighter({ nodeType: 'code-block' })];
        Prism.hooks.add('complete',this.forceRender)
    }

    render() {
        const { classes } = this.props;
        return this.state.display?(
            <Editor
                value={this.state.value}
                onChange={({ value }) => {
                    if (value.document != this.state.value.document) {
                        localStorage.setItem('content', JSON.stringify(value.toJSON()))
                    }
                    this.setState({ ...this.state, value })
                }}
                plugins={this.plugins}
            />
        ):null
    }

    forceRender=()=>{
        this.setState({...this.state, display: false})
        console.log("Force Rendering")
        this.setState({...this.state, display: true})
    }
}

export default withStyles(styles, { withTheme: true })(JottsEditor)
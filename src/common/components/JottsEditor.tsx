import React from 'react';
import { Value } from 'slate';
import { Editor, Plugin } from 'slate-react';

import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

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
                nodes: [],
            },
        })

class JottsEditor extends React.Component<Props, State> {
    private plugins: Plugin[]
    constructor(props: Props) {
        super(props)
        this.state = {
            value: initialValue
        }
        this.plugins = [rtePlugin({ theme: this.props.theme })];
    }
    render() {
        const { classes } = this.props
        return (
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
        )
    }
}

export default withStyles(styles, { withTheme: true })(JottsEditor)
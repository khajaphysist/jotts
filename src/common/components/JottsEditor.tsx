import '../../static/prism.css';

import _ from 'lodash';
import Prism from 'prismjs';
import React from 'react';
import { Value } from 'slate';
import { Editor, Plugin } from 'slate-react';

import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

import CodeHighlighter from './slate-plugins/CodeHighlighter';
import RichTextEditor from './slate-plugins/RichTextEditor';

const styles = (theme: Theme) => createStyles({
});

type ComponentProps = {
    onChange?: (value: string) => any,
    debounceInterval?: number,
    initialValue?: string | null
}

type StyleProps = WithStyles<typeof styles, true>

type Props = StyleProps & ComponentProps

interface State {
    value: Value,
    display: boolean,
}

const START_VALUE = 'Start Jotting...';

export const generateInitialValue = (message?: string) => JSON.stringify(showMessageValue(message || START_VALUE).toJSON())

const showMessageValue = (message: string) =>
    Value.fromJSON(
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

const initialValue = (value: string | null | undefined): Value => {
    if (!value) {
        return showMessageValue(START_VALUE)
    }
    try {
        return Value.fromJSON(JSON.parse(value))
    } catch (e) {
        console.log(e)
        return showMessageValue('Some error occurred when reading value...')
    }
};

class JottsEditor extends React.Component<Props, State> {
    private plugins: Plugin[]
    constructor(props: Props) {
        super(props)
        this.state = {
            value: initialValue(this.props.initialValue),
            display: true
        }
        this.plugins = [RichTextEditor({ theme: this.props.theme }), CodeHighlighter({ nodeType: 'code-block' })];
        Prism.hooks.add('complete', this.forceRender);
    }

    render() {
        const { classes } = this.props;
        return this.state.display ? (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                plugins={this.plugins}
            />
        ) : null
    }

    onChange = ({ value }: { operations: any, value: Value }) => {
        if (value.document != this.state.value.document) {
            this.setState({ ...this.state, value });
            this.externalOnChange(value)
        }
    }

    externalOnChange = _.debounce(async (value: Value) => {
        const serializedValue = JSON.stringify(value.toJSON());
        if (this.props.onChange) {
            await this.props.onChange(serializedValue)
        }
    }, this.props.debounceInterval !== undefined ? this.props.debounceInterval : 200)

    forceRender = () => {
        this.setState({ ...this.state, display: false })
        console.log("Force Rendering")
        this.setState({ ...this.state, display: true })
    }
}

export default withStyles(styles, { withTheme: true })(JottsEditor)
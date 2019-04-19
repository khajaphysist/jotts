import React from 'react';
import AsyncSelect from 'react-select/lib/Async';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        margin: 2 * theme.spacing.unit
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});


interface OptionType {
    value: string
    label: string
}

type StyleProps = WithStyles<typeof styles, true>;
interface ComponentProps {
    options: string[],
    loadOptions: (input: string, callback: (options: string[]) => void) => void | Promise<void>,
    onChange: (selected: string[]) => void,
    defaultSelected: string[]
}
type Props = StyleProps & ComponentProps;
interface State {
    selected: string[]
}

class IntegrationReactSelect extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);
        this.state = { selected: props.defaultSelected }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <AsyncSelect<OptionType>
                    classes={classes}
                    styles={{
                        input: base => ({
                            ...base,
                            color: theme.palette.text.primary,
                            '& input': {
                                font: 'inherit',
                            },
                        }),
                    }}
                    textFieldProps={{
                        label: 'Label',
                        InputLabelProps: {
                            shrink: true,
                        },
                    }}
                    value={this.state.selected.map(o=>({value:o, label: o}))}
                    defaultOptions={this.props.options.map(o => ({ value: o, label: o }))}
                    onChange={(v, _a) => {
                        if(v && v instanceof Array){
                            this.setState({...this.state, selected: v.map(o=>o.value)})
                            this.props.onChange(v.map(o=>o.value))
                        }
                    }}
                    placeholder="Select tags"
                    isMulti
                    loadOptions={(input, callback) => this.props.loadOptions(input, (options) => callback(options.map(o => ({ value: o, label: o }))))}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
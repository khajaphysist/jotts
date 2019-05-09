import classNames from 'classnames';
import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { ValueContainerProps } from 'react-select/lib/components/containers';
import { ControlProps } from 'react-select/lib/components/Control';
import { MenuProps } from 'react-select/lib/components/Menu';
import { MultiValueProps } from 'react-select/lib/components/MultiValue';
import { OptionProps } from 'react-select/lib/components/Option';
import { PlaceholderProps } from 'react-select/lib/components/Placeholder';

import { Chip, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1
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

function NoOptionsMessage(props: any) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }: any) {
    return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType>) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props: OptionProps<OptionType>) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props: PlaceholderProps<OptionType>) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function ValueContainer(props: ValueContainerProps<OptionType>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props: MultiValueProps<OptionType>) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props: MenuProps<OptionType>) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}


interface OptionType {
    value: any
    label: string
}

type StyleProps = WithStyles<typeof styles, true>;
interface ComponentProps {
    defaultOptions: OptionType[],
    loadOptions: (input: string, callback: (options: OptionType[]) => void) => void | Promise<void>,
    onChange: (selected: OptionType[]) => void,
    value: OptionType[]
}
type Props = StyleProps & ComponentProps;

class IntegrationReactSelect extends React.Component<Props> {

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
                        label: 'Tags',
                        InputLabelProps: {
                            shrink: true,
                        },
                    }}
                    value={this.props.value}
                    defaultOptions={this.props.defaultOptions}
                    onChange={(v, _a) => {
                        if (v && v instanceof Array) {
                            return this.props.onChange(v)
                        } else if (v) {
                            return this.props.onChange([v])
                        } else {
                            return this.props.onChange([])
                        }
                    }}
                    components={{
                        Control,
                        Menu,
                        MultiValue,
                        NoOptionsMessage,
                        Option,
                        Placeholder,
                        ValueContainer,
                    }}
                    placeholder="Select tags"
                    isMulti
                    loadOptions={this.props.loadOptions}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
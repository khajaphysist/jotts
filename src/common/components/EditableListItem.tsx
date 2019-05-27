import React from 'react';

import {
  IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Menu, MenuItem,
  TextField
} from '@material-ui/core';
import { ListItemProps } from '@material-ui/core/ListItem';
import {
  Check as CheckIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon, MoreVert as MoreIcon
} from '@material-ui/icons';

interface EditableListItemProps {
    listItemProps?: ListItemProps
    initialValue: string;
    onChange: (value: string) => any;
    actions?: React.ReactChild[]
}

interface EditableListItemState {
    value: string
    edit: boolean
    anchorEl: any
}

export default class EditableListItem extends React.Component<EditableListItemProps, EditableListItemState> {
    constructor(props: EditableListItemProps) {
        super(props)
        this.state = { edit: false, value: this.props.initialValue, anchorEl: undefined }
    }
    handleClose = () => {
        this.setState({ ...this.state, anchorEl: undefined })
    }
    handleEdit = () => {
        this.setState({ ...this.state, edit: true, anchorEl: undefined })
    }
    handleFinishEdit = async () => {
        try {
            if (this.state.value !== this.props.initialValue) {
                await this.props.onChange(this.state.value)
            }
            this.setState({ ...this.state, edit: false })
        } catch (error) {
            console.log(error)
            this.setState({ ...this.state, edit: false, value: this.props.initialValue })
        }
    }
    render() {
        return (
            <ListItem
                button
                component="a"
                {...this.props.listItemProps}
            >
                <ListItemIcon>
                    {
                        this.props.listItemProps && this.props.listItemProps.selected ?
                            (<FolderOpenIcon />)
                            :
                            (<FolderIcon />)
                    }
                </ListItemIcon>
                {
                    this.state.edit ?
                        (
                            <TextField value={this.state.value}
                                onChange={
                                    e => this.setState({ ...this.state, value: e.target.value })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        this.handleFinishEdit()
                                    }
                                }}
                            />
                        )
                        :
                        (
                            <ListItemText inset primary={this.state.value} />
                        )
                }
                <ListItemSecondaryAction>
                    {
                        this.state.edit ?
                            (
                                <IconButton
                                    onClick={this.handleFinishEdit}>
                                    <CheckIcon />
                                </IconButton>
                            ) :
                            (
                                <IconButton
                                    onClick={(e) => {
                                        this.setState({ ...this.state, anchorEl: e.currentTarget })
                                    }}>
                                    <MoreIcon />
                                </IconButton>
                            )
                    }
                    <Menu
                        open={Boolean(this.state.anchorEl)}
                        onBackdropClick={this.handleClose}
                        anchorEl={this.state.anchorEl}
                        onClick={this.handleClose}
                    >
                        <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
                        {this.props.actions}
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
    componentDidUpdate(prevProps: EditableListItemProps) {
        if (prevProps.initialValue !== this.props.initialValue) {
            this.setState({ ...this.state, value: this.props.initialValue })
        }
    }
}
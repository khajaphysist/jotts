import { ListItemProps } from "@material-ui/core/ListItem";

import React from "react";

import { ListItem, ListItemIcon, TextField, ListItemText, ListItemSecondaryAction, IconButton, Menu, MenuItem } from "@material-ui/core";
import {
    Check as CheckIcon, Folder as FolderIcon,
    FolderOpen as FolderOpenIcon, MoreVert as MoreIcon,
} from '@material-ui/icons';

interface EditableListItemProps {
    listItemProps?: ListItemProps
    initialValue: string;
    onChange: (value: string) => any;
    onDelete?: () => void
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
    handleDelete = () => {
        this.setState({ ...this.state, edit: false, anchorEl: undefined }, () => this.props.onDelete ? this.props.onDelete() : void 0)
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
                    >
                        <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
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
import React from 'react';

import {
  IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Menu
} from '@material-ui/core';
import { ListItemProps } from '@material-ui/core/ListItem';
import { MoreVert as MoreIcon, Note, Public } from '@material-ui/icons';

interface PostViewInFolderProps extends ListItemProps {
    menuActions?: React.ReactChild[]
    postTitle: string
    isPublic?: boolean
}

interface PostViewInFolderState {
    anchorEl: any
}

export default class PostViewInFolder extends React.Component<PostViewInFolderProps, PostViewInFolderState> {
    constructor(props: PostViewInFolderProps) {
        super(props)
        this.state = { anchorEl: undefined }
    }
    handleClose = () => {
        this.setState({ ...this.state, anchorEl: undefined })
    }
    render() {
        const { menuActions, postTitle, isPublic, ...rest } = this.props
        return (
            <ListItem

                button
                component="a"
                {...rest}
            >
                <ListItemIcon>
                    <Note />
                </ListItemIcon>
                <ListItemText inset primary={postTitle} />
                {
                    isPublic ? <Public color="disabled" style={{marginRight: 4}}/> : null
                }
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={(e) => {
                            this.setState({ ...this.state, anchorEl: e.currentTarget })
                        }}>
                        <MoreIcon />
                    </IconButton>
                    <Menu
                        open={Boolean(this.state.anchorEl)}
                        onBackdropClick={this.handleClose}
                        anchorEl={this.state.anchorEl}
                        onClick={this.handleClose}
                        style={{marginTop:16}}
                    >
                        {menuActions}
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}
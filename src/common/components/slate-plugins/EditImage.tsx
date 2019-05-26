import React from 'react';
import { Block, Editor, Inline } from 'slate';

import {
  ClickAwayListener, createStyles, IconButton, Paper, TextField, Tooltip, withStyles, WithStyles
} from '@material-ui/core';
import { AddPhotoAlternate } from '@material-ui/icons';

import { loggedInUser } from '../../utils/loginStateProvider';
import { s3ImagePrefix } from '../../vars';
import SelectImage from '../apollo/SelectImage';

const styles = createStyles({
    tooltip: {
        backgroundColor: 'transparent'
    },
    popper: {
        opacity: 1
    }
});
type StyleProps = WithStyles<typeof styles>
type Props = StyleProps & { editor: Editor, node: Block | Inline }
interface State {
    popupOpen: boolean
}

class EditImage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { popupOpen: false }
    }
    render() {
        const { editor, node, classes } = this.props
        const url: string | null | undefined = node.data.get('url');
        const imgId: string | null | undefined = node.data.get('imgId')
        const imgSrc = imgId ? `${s3ImagePrefix}/${imgId}` : url ? url : ''
        const user = loggedInUser();
        return (
            <div
                contentEditable={false}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center",
                }}>

                <Tooltip
                    interactive
                    classes={{ tooltip: classes.tooltip, popper: classes.popper, popperInteractive: classes.popper }}
                    open={this.state.popupOpen}
                    title={
                        !editor.readOnly ? (
                            <ClickAwayListener onClickAway={() => this.setState({ ...this.state, popupOpen: false })}>
                                <Paper style={{ width: 400 }}>
                                    <TextField
                                        value={url ? url : ''}
                                        fullWidth
                                        onChange={event => {
                                            event.preventDefault();
                                            editor.setNodeByKey(node.key, { data: { url: event.target.value, imgId: null }, type: node.type })
                                        }}
                                        label="Custom Url"
                                    />
                                    {
                                        user ? (
                                            <SelectImage
                                                value={imgId ? imgId : null}
                                                user={user}
                                                onChange={imgId => {
                                                    editor.setNodeByKey(node.key, { data: { imgId, url: null }, type: node.type })
                                                }}
                                                label="My Images"
                                            />
                                        ) : null
                                    }
                                </Paper>
                            </ClickAwayListener>
                        ) : ''
                    }
                >
                    <div
                        onClick={editor.readOnly ? () => void 0 : () => {
                            editor.blur()
                            this.setState({ ...this.state, popupOpen: !this.state.popupOpen })
                        }}
                    >
                        {
                            imgSrc ?
                                (
                                    <img
                                        src={imgSrc}
                                        contentEditable={false}
                                        style={{
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            marginBottom: 4,
                                        }}
                                        placeholder="Image"
                                    />
                                ) :
                                (
                                    <IconButton>
                                        <AddPhotoAlternate />
                                    </IconButton>
                                )
                        }
                    </div>
                </Tooltip>
            </div>
        )
    }
}

export default withStyles(styles)(EditImage)
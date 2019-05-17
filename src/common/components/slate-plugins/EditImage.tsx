import { useState } from 'react';
import { Block, Editor, Inline } from 'slate';

import { TextField } from '@material-ui/core';

import { loggedInUser } from '../../utils/loginStateProvider';
import SelectImage from '../apollo/SelectImage';
import { s3ImagesUrl } from '../Constants';

export function EditImage(props: { editor: Editor, node: Block | Inline }) {
    const { editor, node } = props
    const url: string | null | undefined = node.data.get('url');
    const imgId: string | null | undefined = node.data.get('imgId')
    const imgSrc = imgId ? `${s3ImagesUrl}/${imgId}` : url ? url : ''
    const user = loggedInUser();
    const [state, setState] = useState({ edit: !Boolean(imgSrc) });
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
        }}>
            <img
                src={imgSrc}
                onClick={editor.readOnly ? () => void 0 : () => setState({ ...state, edit: !state.edit })}
                contentEditable={false}
                style={{ maxHeight: 900, maxWidth: 900 }}
            />
            {
                state.edit && !editor.readOnly ? (
                    <div contentEditable={false} style={{ width: 300 }}>
                        <TextField
                            value={url ? url : ''}
                            fullWidth
                            onChange={event => {
                                event.preventDefault();
                                console.log("CAD")
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
                    </div>
                ) : null
            }
        </div>
    )
}
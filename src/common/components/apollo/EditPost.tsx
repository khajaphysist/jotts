import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import dynamic from 'next/dynamic';
import React from 'react';
import slugify from 'slug';

import { InputBase, Paper } from '@material-ui/core';
import { InputBaseProps } from '@material-ui/core/InputBase';

import { generateInitialValue } from '../JottsEditor';

const JottsEditor = dynamic(() => import('../JottsEditor'), { ssr: false })
const SelectTags = dynamic(() => import('../apollo/SelectTags'), { ssr: false })

function TitleInput(props: InputBaseProps) {
    return (
        <Paper style={{
            padding: 4
        }}>
            <InputBase {...props} />
        </Paper>
    )
}

const getPost = gql`
query GetPost($id: uuid!){
    jotts_post_by_pk(id: $id) {
        id
        title
        slug
        content
        post_tags {
            tag
        }
    }
}
`
const editPostMutation = gql`
mutation EditPost($postId: uuid!, $title: String!, $slug: String!, $content: String){
    update_jotts_post(
        where: {id: {_eq: $postId}},
        _set: {title: $title,slug:$slug,content:$content}
        ) {
            affected_rows
    }
}
`

interface ComponentProps {
    postId?: string,
    client?: ApolloClient<any>
}

type Props = ComponentProps;
interface State {
    id: string;
    title: string;
    slug: string;
    content: string;
    tags: string[]
}

class EditPostComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            slug: '',
            content: generateInitialValue(),
            tags: []
        }
    }
    render() {
        return (
            <div style={{ maxWidth: 1200, minWidth: 900 }}>
                <TitleInput placeholder="Title" value={this.state.title} onChange={(e) => this.setState({ ...this.state, title: e.target.value, slug: slugify(e.target.value + '-' + this.state.id) })} />
                <SelectTags defaultSelected={this.state.tags} onChange={tags => this.setState({ ...this.state, tags })} />
                <JottsEditor initialValue={this.state.content} onChange={value => this.setState({ ...this.state, content: value })} />
            </div>
        )
    }
}

export default EditPostComponent;